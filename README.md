# Intro

This is my submission for the `Web 3D Applications` module. Information about how the project was developed is actually found in the `about.html` page.

The website is live and available [here](https://users.sussex.ac.uk/~jc2046/), please refer to it if you're having trouble running the project locally or just want to see it in action without setting it up (bear in mind the university server is quite slow at times).

## Requirements

- [Node.js](https://nodejs.org/) (v22 or higher)

## Main Packages

- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/)

## Commands:

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (outputs to \dist folder)
npm run build

# Preview the production build
npm run preview
```

## Get Started

0. Install `Node` if you haven't already (link is in the requirements section above).
1. In the terminal, navigate to the root of the project.
2. Run `npm install` to install the dependencies.
3. Run `npm run dev` to start the development server.
4. Open the URL provided in the terminal (usually `http://localhost:5173/~jc2046/`) in your browser to access the application.

## Project Structure

All of the code is in the `src` folder, except for `HTML` files, which are in the root (`/`) of the project and in `public/assets/info` (these are fragments of `HTML` that, if needed, are injected at runtime).

`public/assets` stores all of the assets used in the project: `glb` models with their respective previews and `HTML` info fragments, HDRI environments, images.

All of the `Blender` files (and relative assets used during development) are in the `blender` folder, which is not needed for the application itself, but is included as part of my submission. Note that only a single `.blend` per model is included (instead of all the incremental saves I made during development), as to no submit hundreds of megabytes of redundant data.
