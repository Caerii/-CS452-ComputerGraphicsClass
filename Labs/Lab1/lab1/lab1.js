// Alif Jakir, jakirab@clarkson.edu, CS452 Graphics Spring 2022
// The following program displays several shapes.

var gl;
var myShaderProgramShape1;
var myShaderProgramShape2;
var myShaderProgramShape3;
var canvas;

function init() {
    canvas=document.getElementById("gl-canvas"); // Set up the canvas
    gl=WebGLUtils.setupWebGL(canvas); //set up webgl context, like a handle
    if (!gl) { alert( "WebGL is not available" ); }
    
    gl.viewport( 0, 0, 512, 512 );   // Set up the viewport x, y, width, height

    gl.clearColor( 1.0, 0.7, 0.2, 1.0 ); // Set up the background color (r, g, b, transparency)
    
    gl.clear( gl.COLOR_BUFFER_BIT ); // Force the WebGL context to clear the color buffer
    
    // Create shader program, needs vertex and fragment shader code
    // in GLSL to be written in HTML file
    // It compiles them into a program for drawing content
    myShaderProgramShape1 =
        initShaders( gl,"vertex-shader", "fragment-shader-1" );

    myShaderProgramShape2 =
        initShaders( gl,"vertex-shader", "fragment-shader-2" );

    myShaderProgramShape3 =
        initShaders( gl,"vertex-shader", "fragment-shader-3" );

    gl.useProgram( myShaderProgramShape1 );
    drawShape1();

    gl.useProgram( myShaderProgramShape2 );
    drawShape2();

    gl.useProgram( myShaderProgramShape3 );
    drawShape3();

}

function drawShape1() {
    // Enter array set up code here
    // We will put all the values we need for our square

    var arrayOfPoints1 = [];
    var p0 = vec2( -0.2, 0.7 );
    var p1 = vec2( -0.9, 0.5 );
    var p2 = vec2( -0.9, 0.65 );
    var p3 = vec2( -0.8, 0.7 );
    var p4 = vec2( -0.5, 0.2 );
    var p5 = vec2( -0.6, -0.2 );
    var p6 = vec2( 0.3, 0.45 );
    var p7 = vec2( -0.4, 0.4 );

    // Concatenate the points
    arrayOfPoints1.push( p0 );
    arrayOfPoints1.push( p1 );
    arrayOfPoints1.push( p2 );
    arrayOfPoints1.push( p3 );
    arrayOfPoints1.push( p4 );
    arrayOfPoints1.push( p5 );
    arrayOfPoints1.push( p6 );
    arrayOfPoints1.push( p7 );

    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,
                  flatten(arrayOfPoints1), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionHandle1 = gl.getAttribLocation( myShaderProgramShape1, "myPosition" );
    gl.vertexAttribPointer( myPositionHandle1, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionHandle1 );
    
    // Force a draw of shape1 using the
    // 'drawArrays()' call
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);

    // We also have: POINTS (individual points) and LINE_STRIP (draws line segments) and LINE_LOOP (draws connected line segments)
    // To make any shape we have: FAN (one to all points), points provided in consecutive order into array, starting from first as the fan core
    // TRIANGLE_STRIP allows us to have a zigzag strip. But you have to be careful about the order of the points. Be careful to specify adjacent triangles!

    // How can you draw a square? Use either the FAN or STRIP!
    // Fan is easier


}

function drawShape2() {
    // Enter array set up code here
    // We will put all the values we need for our square

    var arrayOfPoints1 = [];
    var p0 = vec2( 1.0, 1.0 );
    var p1 = vec2( 0.9, 0.8 );
    var p2 = vec2( 0.7, 0.65 );

    // Concatenate the points
    arrayOfPoints1.push( p0 );
    arrayOfPoints1.push( p1 );
    arrayOfPoints1.push( p2 );

    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,
                  flatten(arrayOfPoints1), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionHandle2 = gl.getAttribLocation( myShaderProgramShape2, "myPosition" );
    gl.vertexAttribPointer( myPositionHandle2, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionHandle2 );
    
    // Force a draw of shape1 using the
    // 'drawArrays()' call
    gl.drawArrays(gl.LINE_LOOP, 0, 3);

    // We also have: POINTS (individual points) and LINE_STRIP (draws line segments) and LINE_LOOP (draws connected line segments)
    // To make any shape we have: FAN (one to all points), points provided in consecutive order into array, starting from first as the fan core
    // TRIANGLE_STRIP allows us to have a zigzag strip. But you have to be careful about the order of the points. Be careful to specify adjacent triangles!

    // How can you draw a square? Use either the FAN or STRIP!
    // Fan is easier


}

function drawShape3() {

    // Enter array set up code here
    // We will put all the values we need for our square

    var arrayOfPointsForCircle = [];
    
    // Enter array setup code here
    // Use the implicit form of the circle equation here:
    // (x-a)^2 + (y-b)^2 = r^2.
    var theta = 0.0;
    var x;
    var y;
    var n = 64;
    var thetastep = 2.0 * Math.PI / n;

    // arrayOfPointsForCircle.push (vec2( 0.0, 0.0 ) ); //starts from origin
    for ( i = 0; i < n; i++ ) {
        theta = i * thetastep;
        x = 0.2 * Math.cos( theta ) + 0.5;
        y = 0.4 * Math.sin( theta ) - 0.5;
        var p = vec2( x,y );
        arrayOfPointsForCircle.push( p );
    }

    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,
                  flatten(arrayOfPointsForCircle), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionHandle3 = gl.getAttribLocation( myShaderProgramShape3, "myPosition" );
    gl.vertexAttribPointer( myPositionHandle3, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionHandle3 );

    gl.drawArrays(gl.TRIANGLE_FAN, 0, n)

}