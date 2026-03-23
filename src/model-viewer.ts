import { models, prettyId, type Model } from './models';
import { SceneManager } from './scene';

// UI elements
const canvas = document.getElementById('model-viewer-canvas') as HTMLCanvasElement;
const modelSelect = document.getElementById('model-select') as HTMLSelectElement;
const animationBtn = document.getElementById('btn-toggle-animation') as HTMLButtonElement;
const panel = document.getElementById('controls-panel')!;
const toggleBtn = document.getElementById('btn-controls-toggle')!;
const closeBtn = document.getElementById('btn-controls-close')!;
const wireframeInput = document.getElementById('input-wireframe') as HTMLInputElement;
const bgColorInput = document.getElementById('input-bg-color') as HTMLInputElement;
const lightIntensityInput = document.getElementById('input-light-intensity') as HTMLInputElement;
const lightColorInput = document.getElementById('input-light-color') as HTMLInputElement;
const resetSceneBtn = document.getElementById('btn-reset-scene')!;
const assembleBtnTemplate = document.getElementById('btn-assemble-template') as HTMLTemplateElement;
const disassembleBtnTemplate = document.getElementById(
    'btn-disassemble-template'
) as HTMLTemplateElement;

// --- Functions

/**
 * Gets the model specified in the URL query parameters, or defaults to the first model if no valid
 * model is specified.
 * @returns The model to load based on the URL query parameters or a default model (first in the list).
 */
function getModelFromUrl(): Model {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('model');
    return models.find((m) => m.id === id) ?? models[0];
}

function hexToColorInput(hex: number): string {
    return `#${hex.toString(16).padStart(6, '0')}`;
}

function colorInputToHex(value: string): number {
    return parseInt(value.replace('#', ''), 16);
}

/**
 * Syncs (most of) the values in the UI to match the current state of the scene.
 * This is used every so often when values in SceneManager are changed programmatically, to ensure the UI reflects those changes.
 */
function syncValues(): void {
    wireframeInput.checked = scene.wireframe;
    bgColorInput.value = hexToColorInput(scene.backgroundColor);
    lightIntensityInput.value = String(scene.lightIntensity);
    lightColorInput.value = hexToColorInput(scene.lightColor);
    modelSelect.value = scene.currentModel?.id ?? models[0].id;
}

/**
 * Syncs the animation button's state to match the current state of the scene.
 */
function syncAnimationButton(): void {
    animationBtn.disabled = false;
    animationBtn.innerHTML = '';
    const template = scene.isAssembled ? disassembleBtnTemplate : assembleBtnTemplate;
    const content = template.content.cloneNode(true) as DocumentFragment;
    animationBtn.appendChild(content);
}

/**
 * Sets up the model select dropdown, populating it with options for each model and setting up an event
 * listener to update the scene when a new model is selected.
 */
function setupModelSelect(): void {
    models.forEach((model) => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = prettyId(model);
        modelSelect.appendChild(option);
    });
    modelSelect.addEventListener('change', () => {
        const model = models.find((m) => m.id === modelSelect.value);
        if (model) scene.loadModel(model);
        syncValues();
    });
}

/**
 * Sets up the control panel, adding event listeners to each of the 'interacteable' components.
 */
function setupControlPanel(): void {
    toggleBtn.addEventListener('click', () => panel.classList.add('-translate-x-full'));
    closeBtn.addEventListener('click', () => panel.classList.remove('-translate-x-full'));

    wireframeInput.addEventListener('change', () => scene.toggleWireframe());

    bgColorInput.addEventListener('input', () => {
        scene.setBackgroundColor(colorInputToHex(bgColorInput.value));
    });

    lightIntensityInput.addEventListener('input', () => {
        scene.setLightIntensity(parseFloat(lightIntensityInput.value));
    });

    lightColorInput.addEventListener('input', () => {
        scene.setLightColor(colorInputToHex(lightColorInput.value));
    });

    resetSceneBtn.addEventListener('click', () => {
        scene.resetScene();
        syncValues();
    });

    animationBtn.addEventListener('click', () => {
        animationBtn.disabled = true;
        scene.disassemble(scene.isAssembled);
    });
}

// --- Setup

// create scene and grab the intial model to load
const initialModel = getModelFromUrl();
const scene = new SceneManager(canvas, initialModel);

// link scene logic to UI
scene.onModelLoaded = () => syncAnimationButton();
scene.onAnimationFinished = () => syncAnimationButton();
setupModelSelect();
setupControlPanel();
// initial sync
scene.syncToCanvasSize();
syncValues();

// link window resize event to scene
window.addEventListener('resize', () => scene.syncToCanvasSize());
