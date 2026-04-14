# To do

[ ] add slider for shadow's quality (NONE - LOW (default) - MID - HIGH) \
[x] make aeropress model \
[x] make aeropress info fragment \
[ ] do about page \
[ ] restructure codebase with better component separation into sub-folders \

# About

This is a small project made for the Web 3D Application module. I decided for it to follow a coffee theme, and develop models of a moka pot, a Chemex, and an AeroPress.

# 3D Models

## Moka

This is the first object I modelled (out of the three made for this project). I spent a great deal of time trying to get it as detailed as possible. because of my inexperience, I ended up doing a lot of manual work connecting vertices and reshaping faces. A lot of this work could've been done faster and better, but I am overall happy with the result!

The body of the moka is mostly made of sharp corners and edges, but has some parts requiring smooth joins. For this reason, most metallic part are set to `auto-smooth` with an angle generous enough to smooth out all of the needed bits while keeping the 'unpolished' metal appearance and feeling. Some edges were set to sharp in order to be unaffected by the smoothing.

The handle, top knob, and the filters needed special treatment. These have surfaces and textures that require much more detail, so they were given subsurface modifiers. I believe these are the reason why the resulting `glb` file is so large. I reckon they could be further optimized, but I don't want to risk losing 'resolution' in my model, so I think the performance hit is worth it, considering I am building this model to be accurate and detailed.

Besides a few minor custom materials, all other textures and materials were taken from [`Poliigon`](https://www.poliigon.com/), possibly another reason for the large file size, since this is the only model that uses them. I was lucky that all I needed was part of the 'free pack', requiring at most minor adjustments.

Animations were simple keyframes translating and rotating objects. It was really easy to setup and, due to the high level of detail in the model, I I think they fit really well. I am really pleased with it!

## Chemex

This was the second model I designed, likely the simplest model overall (except for the animation). Especially considering my newly acquired experience with modelling the Moka, it was fairly easy to make.

The Chemex is made of mostly smooth surfaces, so all of the components (besides the rope) were given a `subsurface` modifier, using various degrees of 'division' depending on the object. There were no real sharp edges, and the most I had to do in this regard was adding a few creases here and there (mostly in the inner part of the collar).

[`Poliigon`](https://www.poliigon.com/) had no free material I could use for this model, so I looked around and found [`BlenderKit`](https://www.blenderkit.com/) offered a lot of free materials that I could use instead. Everything was straight forward to setup, except for the glass, which was either rendering well in blender or in `Three.js` (I tried many glass materials) but ever in both. I think it depended on the way the material was setup. I eventually got it to a point that renders really well in `Three.js`, and is serviceable in blender.

The rope was initially drawn as a curve, then turned into a mesh and adjusted to avoid overlaps and tidy up the knots. The result was good overall, fitting with the 'stiff' leather strap feeling and look.

The animation was strightfoward except for the rope, which was a nightmare. I tried many different ideas:

- using geometry nodes to fade it out layer by layer.
- turning it into a curve and keyframing the bevel level to 'fade it out' from one end to the other.
- using soft-body and cloth modifiers to simulate 'untying' the lace and remove it from the Chemex.
- just fading it out by keyframing the material's alpha value.

All of them worked (some well some not so well) in the editor (in `Blender`) but none exported to `glb`. I worked solely on the rope animation for a good day, trying all these different approaches with all kinds of settings, but nothing. I eventually decided to animate the rope 'stretching' instead, by keyframing two state keys, one being the base state, and the other being a 'stretched' version that follows the other object's position. To make the latter, I simply manually streched the mesh using proportional editing to ensure the shape stays consistent as I move and stretch it around. The overall result is far from what I hoped to achieve, but it's good all considered!

## AeroPress

The last model I developed, and the one I think I am most proud of.
The model itself might be less complex than the others (it is overall a couple of tubes, like a big syringe), but I really like details like the label being 'embedded' into the outer, plastic tube, and the see-through effect. For the latter, I vividly remember struggling on my last model (the Chemex), as it would sometimes render well in blender but not in `Three.js`, and vice versa. This time I think I figured out how to make a good looking see-through material, mostly by trial and error, though learning the proper difference between `alpha` (transparency) and `transmission` I think was the key.

For the label, I added some text to the model, trying to find a font that best matched the original. I then coverted the text to a mesh, which had a very high geometry count, so I also applied a `decimate` modifier to it, which greatly helped. Lastly, I used a `shrinkwrap` modifier to 'wrap' it around the tube.
The result is amazing, although, likely due to the decimation performed earlier, the part of the text would appear more 'flat', leading me to adding a little depth to it (via a `solidify` modifier) to make it pop out a bit more and avoid any z-fighting issues.
The original idea was to then apply a `boolean` modifier to 'engrave' the text into the plastic, but I eventually decided against it, as I preferred the current look more.

Lastly, the 'cap/basket' of the AeroPress was a little complex. I made a series of cylinders and used a `boolean` modifier to 'cut' the holes into it, which overall looked good, considering I was going for a more 'industrial' look (essentially sharper edges). The pattern on the side was a bit more difficult and manual, basically extruding and deleting extra-faces to get to the desired look.

Materials were a mix of custom and polyheaven free materials, though most of the latter proved problematic when exported to `glb` (hence why I had to make custom ones).
Animations follow the same pattern as the rest, basically taking the components apart by keyframing them:
the cap rotates and moves down, revealing a paper filter in the process, while the plunger is pulled up. It is simple but I really liked it, especially paired with the see-through material.

I couldn't be happier with this final model!

# Design

I styled the entire website using `Tailwind` and a handful of custom `CSS` classes. I decided to keep the styling simple and 'flat', by using sharp lines and shadows, and a mellow color scheme consisting of primarly of shades of brown and orange, with black and white used for good constrast.

It is responsive, adapting to the screen size by , if needed, re-arrange content (such as switching between `flex row` and `flex column` layout) or hiding non-essential content when the screen is too small (such as the item's image in the carousel, in the index page).

# Integration

To display the models in the website, I structured my project in the following components, using a `MVC` pattern with the following components:

- `model-viewer.html` -- The `view` component, responsible for the UI. It setup a canvas element in which the 3D model itself will be rendered, all of the buttons and controls needed, and elements in which some extra content (text, videos, and pictures) will be loaded. All of these elements by themselves are 'dumb', their actuall functionality or content will be injected by the `controller`.
- `src/model-viewer.ts` -- The `controller` component, responsible of linking the view to the models, serving as the logic layer. It fetches all of the needed UI elements, and adds listeners to actually make them functional, Additionally, it sets up the models, and then inject the relevant content (based on the model chosen) into the page.
- `src/models.ts` and `src/scene.ts` -- The `models` component. `models.ts` defines data about the models available, and `scene.ts` defines a class that encapsulate the entire 3D scene, treating it as a single entity which itself holds all the needed components (like a renderer, camera, lights, etc). This is especially useful as it allows the controller (`src/model-viewer.ts`) to be leaner, focusing on just 'syncing' the UI with the state of the application.

As mentioned, besides the 3D model itself, additional content is loaded into the page, according to the model chosen. This content content is kept in `public/info` in the form of `HTML` 'fragments' (such as `public/info/aeropress.html`), which is simply fetched and injected into the page at runtime.
The content itself is just in order to add a bit more 'personality' to each page, adding some details about the object shown (such as its history and fun facts), in the form of text, images, and embedded videos.

Each object has been modeeled to have a single animation, disassembling the object into its components. The application relies on this: when a new model is loaded, the `scene` object reads its animations (expecting just a single one) and defines a method to play it in each direction (forward disassemble the object, backwards re-assembles it).

# Interaction

The user can select an object either from the carousel in the `index/home` page, or directly from a dropdown in the `model-viewer`. The user can then inspect the 3D model of the selected object in the canvas element discussed earlier. The user can interact with the canvas itself to rotate, pan, and zoom the camera (the default behaviour provided by `OrbitControls`). Additionally, the user can:

- Toggle the wireframe view on and off.
- Change the background environment of the scene, choosing from a list of available ones.
- Adjust the camera FOV.
- Adjust the color and intensity of a spotlight present in the scene (to play with with the shadows and overall mood of the scene).
- Trigger the object's animation.
- Reset the scene state to the defaults (this resets everything listed above, including the camera's position, excepts for the model loaded, its animation state, and the environment loaded).

Most of these controls are accessible inside a menu in the `model-viewer` canvas, by clicking the hamburger menu at the top-right of it.

# Implementation

I tried to keep the tecnologies/packages used to a minimum. I wanted to avoid CDNs and instead add packages to my app directly, for better IDE context about the packages available/used, better performance (packages embeeded in the app instead of imported on load) and better overall management.

I considered using [`Svelte`](https://svelte.dev/) for ease of development, but since it is a small project overall, I eventually just decided to keep it simple and go framework-less. On the bright side, the project is much simpler: only a handful of `HTML` and `TypeScript` files (besides the assets); On the other end however, it means a bit more manual work fetching components and setting up events, and a bit more repetition in the codebase (such as the navigation bar being repeated across all `HTML` files). While annoying, the repetition is not a big issue in such a small number of files. If the project was to ever grow beyond this, I would definitely switch over to [`Svelte`](https://svelte.dev/) or a similar framework.

Similarly, my testing strategy was also very simple: all of the testing we performed manually, as features were implemented. This is because the application is again fairly simple, and most of the test would be visual anyway, so it would be harder to test them with an automated testing strategy.
As part of the final testing, before submission, I had the following checklist, covering all of the application's features:

## Home page

[ ] Navigation bar links direct to correct page, including the logo. \
[ ] Each carousel item directs to the corresponding model's page. \
[ ] Clicking `left` in the carousel correctly transitions to the previous model in the list (wrapping if the current model is the first in the list). \
[ ] Clicking `right` in the carousel correctly transitions to the next model in the list (wrapping if the current model is the last in the list). \
[ ] On mobile, carousel images are hidden. \
[ ] On desktop, carousel images are displayed.

### Models page (general)

[ ] Navigation bar links direct to correct page, including the logo. \
[ ] Adding `?model=aeropress` to the url correctly loads the page with the AeroPress model selected. \
[ ] Adding `?model=chemex` to the url correctly loads the page with the Chemex model selected. \
[ ] Adding `?model=moka` to the url correctly loads the page with the Moka model selected. \
[ ] Using an invalid id (`?model=test`), the argument is ignored and the first model in the models list is instead loaded. \
[ ] When model is not specified in the url, the first model in the models list is loaded. \
[ ] The 3D canvas' viewport size adjusts as the screen size changes (instead of stretching the image).

### 3D scene controls:

[ ] Pressing the `menu` button in the canvas opens the controls panel. \
[ ] Pressing the `close` button in the controls panel closes it. \
[ ] The `wireframe` checkbox correctly toggles wireframe-mode on and off. \
[ ] Selecting a new `environment` correcly updates the scene. \
[ ] Every single `environments` correctly load when selected. \
[ ] Adjusting the `background blur` slider correctly updates the scene, depending on the value selected. \
[ ] Adjusting the `camera FOV` slider correctly updates the scene, depending on the value selected. \
[ ] Adjusting the `light intensity` slider correctly updates the scene, depending on the value selected. \
[ ] Selecting a new color in the `light color` picker updates the scene, depending on the value selected. \
[ ] The `reset scene` button correctly resets wireframe mode, background blur, camera FOV and position, light intensity, and light color to their default values.

### AeroPress model

[ ] The AeroPress 3D model correctly loads when selected. \
[ ] The page content correctly loads when selected. \
[ ] Clicking `disassemble`, the model animation plays correctly (taking the AeroPress apart). \
[ ] Clicking `assemble`, the model animation plays correctly (putting the AeroPress back together). \
[ ] On mobile, the WAC (world aeropress championship) is displayed below the text. \
[ ] On desktop, the WAC video is displayed on the right side of the text.

### Chemex model

[ ] The Chemex 3D model correctly loads when selected. \
[ ] The page content correctly loads when selected. \
[ ] Clicking `disassemble`, the model animation plays correctly (taking the Chemex apart). \
[ ] Clicking `assemble`, the model animation plays correctly (putting the Chemex back together). \
[ ] On mobile, the 'chemex appearance' gallery stacks vertically. \
[ ] On desktop, the 'chemex appearance' gallery stacks horizontally.

### Moka model

[ ] The Moka 3D model correctly loads when selected. \
[ ] The page content correctly loads when selected. \
[ ] Clicking `disassemble`, the model animation plays correctly (taking the Moka apart). \
[ ] Clicking `assemble`, the model animation plays correctly (putting the Moka back together). \
[ ] On mobile, the x-ray Moka video is displayed below the text. \
[ ] On desktop, the x-ray Moka video is displayed on the right side of the text.
