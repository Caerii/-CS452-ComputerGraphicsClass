Alif Jakir
4/10/22

I first started out with the skeleton code of the implementation of the teapot Gouraud code.
I first scaled the variable values I had so it could handle the 2x larger couch object,
this meant modifying the bounds of the projective planes, and the position of the point light.

I made sure that I could see the silhouette of the couch object first.

I then proceeded to add a second light, a directional light.
I added buttons for toggling the second light, modeled after the button for the first light toggle.
I added a rotating light button that rotates both of the lights.

I proceeded to convert the Gouraud shader code to what is required for Phong shading to work, this meant I needed to
move a lot of the calculations to the Fragment shader, from the Vertex shader.
I modeled this after the Phong code that you provided.

I ran into a weird issue on Windows where I would see a black void around the mesh as the point light would circle the couch.
However, this issue does not occur on Linux and Mac machines.

It was quite difficult to get the Phong working properly due to the number of variables that I had to make sure were placed in the correct spot.
But through a methodical way, I was able to get it working.