import { models, prettyId } from './models.ts';

const VIEW_MODEL_LINK = 'model-viewer.html?model=';
const carousel = document.getElementById('model-preview-carousel')!;
const template = document.getElementById('model-preview-template')! as HTMLTemplateElement;
const counter = document.getElementById('model-preview-counter')!;
const total = models.length;
let current = 0;

/**
 * Go to the slide at the given index, wrapping around if the index is out of bounds.
 * @param index The index of the model to go to.
 */
function goTo(index: number): void {
    current = (index + total) % total;
    carousel.style.transform = `translateX(-${current * 100}%)`;
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

// --- Setup

// Using the template, create a preview slide for each model, then appends it to the carousel.
models.forEach((model) => {
    const previewSlide = template.content.cloneNode(true) as DocumentFragment;
    const link = `${VIEW_MODEL_LINK}${model.id}`;
    const id = prettyId(model);
    previewSlide.querySelector('.model-preview-id')!.textContent = id;
    previewSlide.querySelector('.model-preview-name')!.textContent = model.name;
    previewSlide.querySelector('.model-preview-description')!.textContent = model.description;
    (previewSlide.querySelector('.model-preview-link') as HTMLAnchorElement).href = link;
    const imageElement = previewSlide.querySelector('.model-preview-image') as HTMLImageElement;
    imageElement.src = model.preview;
    imageElement.alt = id;
    carousel.appendChild(previewSlide);
});

// Add event listeners to the previous-next buttons
document.getElementById('prev-model-preview')!.addEventListener('click', () => goTo(current - 1));
document.getElementById('next-model-preview')!.addEventListener('click', () => goTo(current + 1));

// Initialize the carousel to the first slide
goTo(0);
