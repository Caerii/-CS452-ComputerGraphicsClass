function drawTriangle() {
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    var gl=WebGLUtils.setupWebGL(canvas); // WebGL context
    if (!gl) { alert( "WebGL is not available" ); }
    
    // Set up the viewport
    gl.viewport( 0, 0, 512, 512 );   // x, y, width, height
    
    // Set up the background color
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
    
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Create shader program, needs vertex and fragment shader code
    // in GLSL to be written in HTML file
    var myShaderProgram =
        initShaders( gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );

    // ##############################################################
    
    // Enter array set up code here
    arrayOfPoints = [];
    var p0 = vec4(0.0, 0.0, 0.0, 1.0); //xyzw
    var scaleForPoint0 = vec4(0.5, 0.5, 1.0, 1.0);
    var p1 = vec4(1.0, 0.0, 0.0, 1.0);
    var scaleForPoint1 = vec4(0.3, 0.3, 1.0, 1.0);
    var p2 = vec4(0.0, 1.0, 0.0, 1.0);
    var scaleForPoint2 = vec4(0.4, 0.4, 1.0, 1.0);

    arrayOfPoints = [p0, scaleForPoint0, p1, scaleForPoint1, p2, scaleForPoint2];

    //Separate buffer array
    var arrayOfColors = [];
    var color0 = vec4( 0.5, 0.0, 1.0, 1.0 );
    var color1 = vec4( 1.0, 1.0, 0.0, 1.0 );
    var color2 = vec4( 0.0, 1.0, 0.5, 1.0 );
    arrayOfColors = [color0, color1, color2];
    
    
    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var pointsBufferId = gl.createBuffer();
    var colorBufferId = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, pointsBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,
                  flatten(arrayOfPoints), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER,
                    flatten(arrayOfColors), gl.STATIC_DRAW );

    
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    gl.bindBuffer( gl.ARRAY_BUFFER, pointsBufferId );
    var myPositionHandle = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPositionHandle, 4, gl.FLOAT, false, 32, 0 );
    gl.enableVertexAttribArray( myPositionHandle );

    var scaleValueHandle = gl.getAttribLocation( myShaderProgram, "scaleValue" );
    gl.vertexAttribPointer( scaleValueHandle, 4, gl.FLOAT, false, 32, 16 );
    gl.enableVertexAttribArray( scaleValueHandle );

    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId );
    var myColorHandle = gl.getAttribLocation( myShaderProgram, "scaleValue" );
    gl.vertexAttribPointer( myColorHandle, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myColorHandle );
    
    
    
    // Force a draw of the triangle using the
    // 'drawArrays()' call
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

