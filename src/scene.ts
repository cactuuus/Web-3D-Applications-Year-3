import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { type Model } from './models';

// defaults
const BG_COLOR: number = 0x818181;
const FOV: number = 60;
const CAMERA_INITIAL_POS: THREE.Vector3 = new THREE.Vector3(20, 20, 20);
const CAMERA_NEAR: number = 0.1;
const CAMERA_FAR: number = 1000;
const LIGHT_COLOR: number = 0xffffff;
const LIGHT_INTENSITY: number = 0.5;

/**
 * Class to manage the 3D scene, including managing models, camera, lights, etc.
 * It essentially centralizes all of the logic and components needed into a single class.
 */
export class SceneManager {
    readonly canvas: HTMLCanvasElement;
    readonly scene: THREE.Scene;
    readonly camera: THREE.PerspectiveCamera;
    readonly renderer: THREE.WebGLRenderer;
    readonly controls: OrbitControls;
    readonly loader: GLTFLoader;
    readonly timer: THREE.Timer;
    readonly lights: THREE.Light[];
    private _mixer: THREE.AnimationMixer | null = null;
    private _actions: THREE.AnimationAction[] = [];
    private _isAssembled: boolean = true;
    private _isWireframe: boolean = false;
    private _currentModel!: Model; // initialized in loadModel, which is called in the constructor
    onAnimationFinished: (() => void) | null = null;
    onModelLoaded: (() => void) | null = null;

    constructor(canvas: HTMLCanvasElement, model: Model) {
        this.canvas = canvas;
        // scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(BG_COLOR);
        // camera
        this.camera = new THREE.PerspectiveCamera(FOV, 1, CAMERA_NEAR, CAMERA_FAR);
        this.camera.position.copy(CAMERA_INITIAL_POS);
        // renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        // loader & timer
        this.loader = new GLTFLoader();
        this.timer = new THREE.Timer();
        // default lights
        this.lights = [];
        this._resetLights();
        // load initial model
        this.loadModel(model);
        // start animation loop
        this._animate();
    }

    // --- Getters

    get wireframe(): boolean {
        return this._isWireframe;
    }

    get backgroundColor(): number {
        // for now, we assume the background is always a color (not a texture or something else)
        const bgColor = this.scene.background as THREE.Color;
        return bgColor.getHex();
    }

    get lightIntensity(): number {
        return this.lights.length > 0 ? this.lights[0].intensity : 0;
    }

    get lightColor(): number {
        return this.lights.length > 0 ? this.lights[0].color.getHex() : 0;
    }

    get currentModel(): Model | null {
        return this._currentModel;
    }

    get isAssembled(): boolean {
        return this._isAssembled;
    }

    // --- Methods

    /**
     * Loads the given model into the scene, replacing any existing model.
     * If the model has animations (it is expected to have one), it sets up the mixer and actions for
     * controlling the animation playback.
     * @param model The model to load into the scene.
     */
    loadModel(model: Model): void {
        this._unloadModel();
        this._currentModel = model;
        this.loader.load(model.path, (model: GLTF) => {
            this.scene.add(model.scene);
            if (model.animations.length > 0) {
                this._mixer = new THREE.AnimationMixer(model.scene);
                this._mixer.addEventListener('finished', () => {
                    if (this.onAnimationFinished) this.onAnimationFinished();
                });
                this._actions = model.animations.map((clip) => this._mixer!.clipAction(clip));
            }
            if (this.onModelLoaded) this.onModelLoaded();
        });
    }

    /**
     * Helper method to unload the current model from the scene and reset all related properties.
     */
    private _unloadModel(): void {
        this.scene.clear();
        this._mixer = null;
        this._actions = [];
        this._isAssembled = true;
        this._isWireframe = false;
        // re-add lights after clearing the scene
        this.lights.forEach((light) => this.scene.add(light));
    }

    /**
     * Plays the assembly/disassembly animation of the model in the given direction.
     * @param forwards Whether to play the animation forwards (disassembly) or backwards (assembly).
     */
    disassemble(forwards: boolean): void {
        if (!this._mixer || this._actions.length === 0) return;
        const action = this._actions[0];
        action.stop();
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopOnce, 1);
        if (forwards) {
            action.reset();
            action.timeScale = 1;
            this._isAssembled = false;
        } else {
            action.time = action.getClip().duration;
            action.timeScale = -1;
            this._isAssembled = true;
        }
        action.play();
    }

    /**
     * Toggles the 'wireframe view' on and off. It traverses the scene and sets the wireframe property
     * of all materials to new value.
     */
    toggleWireframe(): void {
        this._isWireframe = !this._isWireframe;
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                const materials = Array.isArray(object.material)
                    ? object.material
                    : [object.material];
                materials.forEach((mat) => {
                    mat.wireframe = this._isWireframe;
                });
            }
        });
    }

    /**
     * Sets new background color for the scene.
     * @param color The new background color, as a hexadecimal number.
     */
    setBackgroundColor(color: number): void {
        this.scene.background = new THREE.Color(color);
    }

    /**
     * Sets the intensity of all lights in the scene to the given value.
     * @param intensity The new intensity for the lights.
     */
    setLightIntensity(intensity: number): void {
        this.lights.forEach((light) => (light.intensity = intensity));
    }

    /**
     * Sets new color for all lights in the scene.
     * @param color The new color for the lights, as a hexadecimal number.
     */
    setLightColor(color: number): void {
        this.lights.forEach((light) => (light.color = new THREE.Color(color)));
    }

    /**
     * Updates the renderer and camera aspect ratio to match the current size of the canvas.
     * This should be called whenever the canvas is resized.
     */
    syncToCanvasSize(): void {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    /**
     * The main animation loop. It updates the timer, controls, and mixer on each frame, then renders
     * the scene.
     */
    private _animate(): void {
        requestAnimationFrame(() => this._animate());
        this.timer.update();
        this.controls.update();
        if (this._mixer) this._mixer.update(this.timer.getDelta());
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Resets the lights to their default configuration. It does so by first removing all existing
     * lights from the scene and clearing the lights array, then re-creating the default lights and
     * adding them to the scene and the lights array.
     */
    private _resetLights(): void {
        this.lights.forEach((light) => this.scene.remove(light));
        this.lights.length = 0;
        const ambientLight = new THREE.AmbientLight(LIGHT_COLOR, LIGHT_INTENSITY);
        const directionalLight = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(ambientLight, directionalLight);
        this.lights.push(ambientLight, directionalLight);
    }

    /**
     * Resets the scene to its initial state. It resets the background color, wireframe mode, lights, and
     * camera position and controls target. Note that it does not unload the current model, so the model
     * will remain in the scene after resetting.
     */
    resetScene(): void {
        this.scene.background = new THREE.Color(BG_COLOR);
        this._isWireframe = false;
        this._resetLights();
        this.camera.position.copy(CAMERA_INITIAL_POS);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
}
