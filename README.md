# webgl-weekly-2

Overview
===

A UFO has been sighted!

Our valiant Polish soldiers, Andrzej and Jan, are on the scene patiently waiting to intercept whoever (or whatever) steps out of the vehicle.

They may be there a while.

Optimizations
===

The GLB for the soldiers has been heavily optimized to half its original size by decimating mesh vertices and compressing maps and textures.

The textures for the car have also been compressed, and the model is now 60% of its original size. As it was a low-poly model, I couldn't decimate the vertices further without creating artifacts.

Decisions
===

A panoramic model was chosen as an env map as I wanted to incorporate the background a bit more into the story, as well as preserve scale when a user zoomed in or out. As it also had a sunset, I could direct the directional light from the position of the setting sun, making for a more realistic feel.

It is possible to toggle the camera to first-person view to allow one better experience how the lighting hits, and follow the motion of the car.

A low-level ambient light is also used to slightly illuminate the scene as lighting from only one direction leaves some parts of the scene in complete shadow.

I explored making the car interactive using keyboard buttons to control motion, but the result looked a lot better in my head and this part has been removed.

That's mostly it. Enjoy (or don't).
