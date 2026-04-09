# Intro

Hi, this is a small project made for the Web 3D Application module. I decided for it to follow a coffee theme, and develop models of a moka pot, a Chemex, and an Aeropress.

I tried to keep the tecnologies/packages used to a minimum. I wanted to avoid CDNs and instead add packages to my app directly, for better IDE context about the packages available/used, better performance (packages embeeded in the app instead of imported on load) and better overall management.

I considered using [`Svelte`](https://svelte.dev/) for ease of development, but since it is a small project overall, I eventually just decided to keep it simple and go framework-less. On the bright side, the project is much simpler: only a handful of `HTML` and `TypeScript` files (besides the assets); On the other end though it means a bit more manual work fetching components and setting up events, and a bit more repetition in the codebase (such as the navigation bar being repeated across all `HTML` files). While annoying, the repetition is not that big of an issue in such a small number of files. If the project was to ever grow beyond this, I would definitely switch over to [`Svelte`](https://svelte.dev/) or a similar framework.

## Requirements

- [Node.js](https://nodejs.org/) (v22 or higher)

## Packages

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

# Models Notes

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

## Aeropress

The last model I developed, and the one I think I am most proud of.
The model itself might be less complex than the others (it is overall a couple of tubes, like a big syringe), but I really like details like the label being 'embedded' into the outer, plastic tube, and the see-through effect. For the latter, I vividly remember struggling on my last model (the Chemex), as it would sometimes render well in blender but not in `Three.js`, and vice versa. This time I think I figured out how to make a good looking see-through material, mostly by trial and error, though learning the proper difference between `alpha` (transparency) and `transmission` I think was the key.

For the label, I added some text to the model, trying to find a font that best matched the original. I then coverted the text to a mesh, which had a very high geometry count, so I also applied a `decimate` modifier to it, which greatly helped. Lastly, I used a `shrinkwrap` modifier to 'wrap' it around the tube.
The result is amazing, although, likely due to the decimation performed earlier, the part of the text would appear more 'flat', leading me to adding a little depth to it (via a `solidify` modifier) to make it pop out a bit more and avoid any z-fighting issues.
The original idea was to then apply a `boolean` modifier to 'engrave' the text into the plastic, but I eventually decided against it, as I preferred the current look more.

Lastly, the 'cap/basket' of the Aeropress was a little complex. I made a series of cylinders and used a `boolean` modifier to 'cut' the holes into it, which overall looked good, considering I was going for a more 'industrial' look (essentially sharper edges). The pattern on the side was a bit more difficult and manual, basically extruding and deleting extra-faces to get to the desired look.

Materials were a mix of custom and polyheaven free materials, though most of the latter proved problematic when exported to `glb` (hence why I had to make custom ones).
Animations follow the same pattern as the rest, basically taking the components apart by keyframing them:
the cap rotates and moves down, revealing a paper filter in the process, while the plunger is pulled up. It is simple but I really liked it, especially paired with the see-through material.

I couldn't be happier with this final model!
