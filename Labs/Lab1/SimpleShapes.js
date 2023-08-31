var gl;
var myShaderProgramTri;
var myShaderProgramSq;
var myShaderProgramCircle;
var canvas;

function init() {
    // Set up the canvas
    canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas); //set up webgl context, like a handle
    if (!gl) { alert( "WebGL is not available" ); }
    
    // Set up the viewport
    gl.viewport( 0, 0, 512, 512 );   // x, y, width, height

    // Set up the background color
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 ); //r, g, b, transparency
    
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    // Create shader program, needs vertex and fragment shader code
    // in GLSL to be written in HTML file
    // It compiles them into a program for drawing content
    myShaderProgramTri =
        initShaders( gl,"vertex-shader", "fragment-shader-tri" );

    myShaderProgramSq =
        initShaders( gl,"vertex-shader", "fragment-shader-sq" );

    myShaderProgramCircle =
        initShaders( gl,"vertex-shader", "fragment-shader-sq" );

    //gl.useProgram( myShaderProgramTri );
    //drawTriangle();

    //gl.useProgram( myShaderProgramSq );
    //drawSquare();

    gl.useProgram( myShaderProgramCircle );
    drawCircle2();

}

function drawTriangle() {

    // Enter array set up code here
    // We will put all the values we need for our triangle

    var arrayOfPointsTri = [];
    var p0 = vec2( 0.0, 0.0 );
    var p1 = vec2( 1.0, 0.0 );
    var p2 = vec2( 0.0, 1.0 );

    // Concatenate the points
    arrayOfPointsTri.push( p0 );
    arrayOfPointsTri.push( p1 );
    arrayOfPointsTri.push( p2 );


    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,
                  flatten(arrayOfPointsTri), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionHandleTri = gl.getAttribLocation( myShaderProgramTri, "myPosition" );
    gl.vertexAttribPointer( myPositionHandleTri, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionHandleTri );
    
    
    
    // Force a draw of the triangle using the
    // 'drawArrays()' call
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // We also have: POINTS (individual points) and LINE_STRIP (draws line segments) and LINE_LOOP (draws connected line segments)
    // To make any shape we have: FAN (one to all points), points provided in consecutive order into array, starting from first as the fan core
    // TRIANGLE_STRIP allows us to have a zigzag strip. But you have to be careful about the order of the points. Be careful to specify adjacent triangles!

    // How can you draw a square? Use either the FAN or STRIP!
    //
    
}

function drawSquare() {
    // Enter array set up code here
    // We will put all the values we need for our square

    var arrayOfPointsSq = [];
    var p0 = vec2( 0.0, 0.0 );
    var p1 = vec2( -1.0, 0.0 );
    var p2 = vec2( -1.0, -1.0 );
    var p3 = vec2( 0.0, -1.0 );

    // Concatenate the points
    arrayOfPointsSq.push( p0 );
    arrayOfPointsSq.push( p1 );
    arrayOfPointsSq.push( p2 );
    arrayOfPointsSq.push( p3 );

    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,
                  flatten(arrayOfPointsSq), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionHandleSq = gl.getAttribLocation( myShaderProgramSq, "myPosition" );
    gl.vertexAttribPointer( myPositionHandleSq, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionHandleSq );
    
    // Force a draw of the square using the
    // 'drawArrays()' call
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // We also have: POINTS (individual points) and LINE_STRIP (draws line segments) and LINE_LOOP (draws connected line segments)
    // To make any shape we have: FAN (one to all points), points provided in consecutive order into array, starting from first as the fan core
    // TRIANGLE_STRIP allows us to have a zigzag strip. But you have to be careful about the order of the points. Be careful to specify adjacent triangles!

    // How can you draw a square? Use either the FAN or STRIP!
    // Fan is easier


}

function drawCircle() {
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Enter array set up code here
    // We will put all the values we need for our circle

    var arrayOfPointsForCircle = [];
    
    // Enter array setup code here
    // Use the implicit form of the circle equation here:
    // (x-a)^2 + (y-b)^2 = r^2.
    var xstart = -1.0;
    var xend = 1.0;
    var n = 15;
    var h = (xend-xstart)/(n-1);

    var x = 0.0;
    var y = 0.0;

    var i = 0;
    for (i = 0; i < n; i++) {
        x = xstart + i * h;
        y = Math.sqrt( 1 - x * x );
        var p = vec2( x, y );
        arrayOfPointsForCircle.push( p );

    }

    var i = 0;
    for (i = 0; i < n; i++) {
        x = xstart + i * h;
        y = -Math.sqrt( 1 - x * x );
        var p = vec2( x, y );
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
    var myPositionHandleCircle = gl.getAttribLocation( myShaderProgramCircle, "myPosition" );
    gl.vertexAttribPointer( myPositionHandleCircle, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionHandleCircle );

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 2*n)

}

function drawCircle2() {
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );


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
        x = Math.cos( theta );
        y = Math.sin( theta );
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
    var myPositionHandleCircle = gl.getAttribLocation( myShaderProgramCircle, "myPosition" );
    gl.vertexAttribPointer( myPositionHandleCircle, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionHandleCircle );

    gl.drawArrays(gl.TRIANGLE_FAN, 0, n)

}