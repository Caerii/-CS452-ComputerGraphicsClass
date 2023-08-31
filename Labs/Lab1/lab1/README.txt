Lab done by Alif Jakir

As you can see when you run the program, there are three shapes.

The first is an odd red polygon in the middle-left of the clipspace. This has 8 vertices and is created using TRIANGLE_FAN.

The second is a green hollow triangle in the top right, it has 3 vertices, and it is created using LINE_LOOP.

The third shape is a purple ellipse in the bottom right, the y axis is stretched more than the x axis, making it an ellipse using the appropriate parametric equations.
There are 64 vertices composing the ellipse.

The way that I approached this lab is that I first defined 3 fragment shaders for different colors.
The next thing that I did was to define new functions for different shapes based on the sample code you gave us in class.
I defined a function for each shape that specified its positions. To do this I created vec2 (x,y) pairs for each of the vertices.
This allow me to create a shape for each function. I found it useful to have the browser open, refreshing as I changed various color selections and vertices.