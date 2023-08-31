# Alif Jakir CS452 Computer Graphics
# Lab3

I created a octahedron, I initialized 6 vertices, and I initialized 6 different colors for each vertex.
Each vertex has a different color and each face has interpolated colors.
I made 8 different triangles for each of the faces, with the vertex order counterclockwise.

You can activate or deactivate rotation with the left arrow key.
You can use the WASD and QE keys to rotate on XYZ axes.
'a' will move clockwise around the x axis, 'd' counterclockwise
'w' will move clockwise around the x axis, 's' counterclockwise
'q' will move clockwise around the x axis, 'e' counterclockwise

You can activate or deactivate scale with the up arrow key.
You can use the WASD keys to scale on XY axes.
'a' will shrink along the x axis, 'd' will grow along the x axis
's' will shrink along the y axis, 'w' will grow along the y axis

You can activate or deactivate translation with the right arrow key.
You can use the WASD keys to translation on XY axes.
'a' will translate left, 'd' will translate right
's' will translate down, 'w' will translate up

You can pair these arrow keys to do transformations simultaneously.

You can press the spacebar for a cool spinny animated thing!

All transformations are composed, with scale as the first premultiplication
transformation, rotation as the second, and translation as the third/last.

I apply .1 magnitude for alpha, beta, and gamma (for rotations) as well as for scale in x and y.

I apply .03 magnitude for the translation in x and the translation in y.

---------------------
The way that I approached this problem, was first to specify the coordinates of the vertices
for the octahedron, which is the polygon that I selected.

Then I set out to create the matrices for rotation first. I tested out on the x axis first,
and I was initially using a button press for the interaction. I then changed this to
take in keyboard input for control. I then made sure that I could rotate on all three xyz
axes.

I then moved on to scaling, which was easy enough, and made sure that it also had a key
press associated with it. It wasn't too hard to do translation as well after this,
and I composed all the matrices together.

There are boolean values that correspond to the arrow keys, so you can pair different
types of transformations together along with WASDQE key presses.

The colors I chose for the vertices are ones that I thought were cool, and I tweaked them
a bunch to get something I liked across the color spectrum.

