# To do

[ ] add slider for shadow's quality (NONE - LOW (default) - MID - HIGH) \
[x] make aeropress model \
[x] make aeropress info fragment \
[ ] do about page \

# General notes

## Website

- packaes (using npm):
    - vite (with typescript) -- this and npm itself allow to embed other packages into the app itself,
      which is a lot better than relying on CDNs.
    - tailwind -- for styling, personal preference over bootstrap.
    - three.js -- essential for 3D rendering.
- commands:
    - `npm run dev` -- starts a server for local development.
    - `npm run build` -- builds the app for production (to `\dist` folder).
    - `npm run preview` -- starts a server using the built (static) files.

I tried to keep the tecnologies/packages used to a minimum. I wanted to avoid CDNs and instead add
packages to my app directly, mostly for better IDE context about the packages available/used, better
performance (packages embeeded in the app instead of imported on load) and better overall management.

I considered using Svelte for ease of development, but since it is a small project overall, I
eventually just decided to keep it simple and go framework-less. On the bright side, the project is
much simpler: only a handful of HTML and TypeScript files (besides the assets); On the other end
though it means a bit more manual work fetching components and setting up events, and a bit more
repetition in the codebase (such as the navigation bar being repeated across all HTML files).
While annoying, the repetition is not that big of an issue in such a small number of files. If the
project was to ever grow beyond this, I would definitely switch over to Svelte or a similar framework.

## Moka

This is the first object I modelled (out of the three made for this project). I spent a great deal
of time trying to get it as detailed as possible. because of my inexperience, I ended up doing a lot
of manual work connecting vertices and reshaping faces. A lot of this work could've been done faster
and better, but I am overall happy with the result!

The body of the moka is mostly made of sharp corners and edges, but has some parts requiring smooth
joins. For this reason, most metallic part are set to 'auto-smooth' with an angle generous enough to
smooth out all of the needed bits while keepin the 'unpolished' metal appearance and feeling. Some
edges were set to sharp in order to be unaffected by the smoothing.

The handle, top knob, and the filters needed special treatment. These have surfaces and textures that
require much more detail, so they were given subsurface modifiers. I believe these are the reason why
the resulting `glb` file is so large. I reckon they could be further optimized, but I don't want to
risk losing 'resolution' in my model, so I think the performance hit is worth it, considering I am
building this model to be accurate and detailed.

Besides a few minor custom materials, all other textures and materials were taken from polligon. I was
lucky that all I needed wsa part of the 'free pack', requiring at most minor adjustments.

Animations were simple keyframes translating and rotating objects. It was really easy to setup and,
due to the high level of detail in the model, I I think they fit really well.
I am really pleased with it!

## Chemex

This was the second model I designed. It is overall a simpler model, and especially considering my newly
acquired experience with modelling the Moka, it was fairly easy to make.

The chemex is made of mostly smooth surfaces, so all of the components (besides the rope) were given a
subsurface modifier, using various degrees of 'division' depending on the object. There were no real
sharp edges, and the most I had to do in this regard was adding a few creases here and there (mostly
in the inner part of the collar).

Pollygon had no free material I could use for this model, so I looked around and found blenderkit
offered a lot of free materials that I could use instead. Everything was straight forward to setup,
except for the glass, which was either rendering well in blender or in three_js (I tried many glass
materials) but ever in both. I think it depended on the way the material was setup. I eventually got
it to a point that renders really well in three_js, and is serviceable in blender.

The rope was initially drawn as a curve, then turned into a mesh and adjusted to avoid overlaps and
tidy up the knots. The result was good overall, fitting with the 'stiff' leather strap feeling and look.

The animation was strightfoward except for the rope, which was a nightmare. I tried many different ideas:

- using geometry nodes to fade it out layer by layer.
- turning it into a curve and keyframing the bevel level to 'fade it out' from one end to the other.
- using soft-body and cloth modifiers to simulate 'untying' the lace and remove it from the Chemex.
- just fading it out by keyframing the material's alpha value.

All of them worked (some well some not so well) in the editor (blender) but none exported to `glb`.
I worked solely on the rope animation for a good day, trying all these different approaches with all
kinds of settings, but nothing. I eventually decided to animate the rope 'stretching' instead, by
keyframing two state keys, one being the base state, and the other being a 'stretched' version that
follows the other object's position. To make the latter, I simply manually streched the mesh using
proportional editing to ensure the shape stays consistent as I move and stretch it around.
The overall result is far from what I hoped to achieve, but it's good all considered!
