import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/examples/jsm/Addons.js';
import { type Environment } from './environments';
import { type Model } from './models';

// default values
const BLUR: number = 0;
const FOV: number = 60;
const CAMERA_INITIAL_POS: THREE.Vector3 = new THREE.Vector3(10, 5, 10);
const CAMERA_NEAR: number = 0.1;
const CAMERA_FAR: number = 1000;
const LIGHT_POS: THREE.Vector3 = new THREE.Vector3(5, 5, 5);
const LIGHT_COLOR: number = 0xffebc1; // warm light color
const LIGHT_SHADOW_BIAS: number = -0.0001; // helps reduce shadow artifacts
const LIGHT_SHADOW_MAP_SIZE: number = 2048; // quality of shadows
const LIGHT_INTENSITY: number = 1.5;

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
    readonly timer: THREE.Timer;
    readonly light: THREE.DirectionalLight;
    private _mixer: THREE.AnimationMixer | null = null;
    private _actions: THREE.AnimationAction[] = [];
    private _isAssembled: boolean = true;
    private _isWireframe: boolean = false;
    private _model!: Model; // initialized in loadModel, which is called in the constructor
    private _environment!: Environment; // also initialized in loadModel
    onAnimationFinished: (() => void) | null = null;
    onModelLoaded: (() => void) | null = null;

    constructor(canvas: HTMLCanvasElement, model: Model, environment: Environment) {
        this.canvas = canvas;
        // scene
        this.scene = new THREE.Scene();
        this.scene.backgroundBlurriness = BLUR;
        // camera
        this.camera = new THREE.PerspectiveCamera(FOV, 1, CAMERA_NEAR, CAMERA_FAR);
        this.camera.position.copy(CAMERA_INITIAL_POS);
        // renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        // controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        // timer
        this.timer = new THREE.Timer();
        // default light
        this.light = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
        this.light.castShadow = true;
        this.light.shadow.bias = LIGHT_SHADOW_BIAS;
        this.light.shadow.mapSize.set(LIGHT_SHADOW_MAP_SIZE, LIGHT_SHADOW_MAP_SIZE);
        this.light.position.copy(LIGHT_POS);
        this.scene.add(this.light);
        // load initial environment & model
        this.loadEnvironment(environment);
        this.loadModel(model);
        // start animation loop
        this._animate();
    }

    // --- Getters

    get wireframe(): boolean {
        return this._isWireframe;
    }

    get currentModel(): Model | null {
        return this._model;
    }

    get isAssembled(): boolean {
        return this._isAssembled;
    }

    get environment(): Environment {
        return this._environment;
    }

    get cameraFov(): number {
        return this.camera.fov;
    }

    get backgroundBlur(): number {
        return this.scene.backgroundBlurriness;
    }

    get lightIntensity(): number {
        return this.light.intensity;
    }

    get lightColor(): number {
        return this.light.color.getHex();
    }

    // --- Methods

    /**
     * Loads the given model into the scene, replacing any existing model.
     * If the model has animations (it is expected to have exactly one), it sets up the mixer and
     * actions for controlling the animation playback.
     * @param model The model to load into the scene.
     */
    loadModel(model: Model): void {
        this._unloadModel();
        this._model = model;
        const loader = new GLTFLoader();
        loader.load(model.path, (model: GLTF) => {
            this.scene.add(model.scene);
            if (model.animations.length > 0) {
                this._mixer = new THREE.AnimationMixer(model.scene);
                this._mixer.addEventListener('finished', () => {
                    if (this.onAnimationFinished) this.onAnimationFinished();
                });
                this._actions = model.animations.map((clip) => this._mixer!.clipAction(clip));
            }
            // enable shadows
            this.scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });
            this.onModelLoaded?.();
        });
    }

    /**
     * Helper method to unload the current model from the scene and reset all related properties.
     */
    private _unloadModel(): void {
        // dispose of all meshes and materials to free up memory, then clear the scene
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach((mat) => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        this.scene.clear();
        this._mixer = null;
        this._actions = [];
        this._isAssembled = true;
        this._isWireframe = false;
        // re-add light after clearing the scene
        this.scene.add(this.light);
    }

    /**
     * Loads the given environment map as the scene's background.
     * @param environment The environment to load into the scene.
     */
    loadEnvironment(environment: Environment): void {
        const loader = new HDRLoader();
        this._environment = environment;
        loader.load(this._environment.path, (env) => {
            env.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = env;
            this.scene.background = env;
        });
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
     * @param state Optional boolean to enforce a state. If not provided, it flips the current state.
     */
    toggleWireframe(state?: boolean): void {
        this._isWireframe = state ?? !this._isWireframe;
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
     * Sets the blurriness of the scene's background.
     * @param value The new blur value to assign.
     */
    setBackgroundBlur(value: number): void {
        this.scene.backgroundBlurriness = value;
    }

    /**
     * Sets the camera's FOV.
     * @param value The new FOV value to assign.
     */
    setCameraFov(value: number): void {
        this.camera.fov = value;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Sets intensity of the spotlight.
     * @param value The new intensity value to assign.
     */
    setLightIntensity(value: number): void {
        this.light.intensity = value;
    }

    /**
     * Set the color of the spotlight
     * @param value The new color to assign, in HEX format.
     */
    setLightColor(value: number): void {
        this.light.color.setHex(value);
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
     * Resets the scene to its initial state. It resets the background color, wireframe mode, lights, and
     * camera position and controls target. Note that it does not unload the current model, so the model
     * will remain in the scene after resetting.
     */
    resetScene(): void {
        this.toggleWireframe(false);
        this.setBackgroundBlur(BLUR);
        this.setCameraFov(FOV);
        this.setLightIntensity(LIGHT_INTENSITY);
        this.setLightColor(LIGHT_COLOR);
        this.camera.position.copy(CAMERA_INITIAL_POS);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
}
