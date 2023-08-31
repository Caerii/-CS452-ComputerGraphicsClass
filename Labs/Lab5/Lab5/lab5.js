var gl;
var myShaderProgram;

var alpha;
var beta;
var gamma;

var tx;
var ty;

var sx;
var sy;
var sz;

var keyPressed;
var rotateBool;
var scaleBool;
var translateBool;

var isSpinning;

function initGL(){
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, 512, 512);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );

    gl.enable( gl.DEPTH_TEST );

    setupForm();

    render();
    //Enter Code Here

};

function setupForm() {
    alpha = 0;
    beta = 0;
    gamma = 0;
    tx = 0;
    ty = 0;
    sx = 1;
    sy = 1;
    sz = 1;

    sxLoc= gl.getUniformLocation(myShaderProgram, "sx");
    gl.uniform1f(sxLoc, sx);
    syLoc= gl.getUniformLocation(myShaderProgram, "sy");
    gl.uniform1f(syLoc, sy);
    szLoc= gl.getUniformLocation(myShaderProgram, "sz");
    gl.uniform1f(szLoc, sz);

    keyPressed = '\0';

    rotateBool = false;
    scaleBool = false;
    translateBool = false;
    isSpinning = false;

    var verticesP =[
        vec4(0.0,0.0,0.2,1),
        vec4(-.2,.0,.0,1),
        vec4(0,.2,0,1),

        vec4(0.0,0.0,0.2,1),
        vec4(0,.2,0,1),
        vec4(.2,0,0,1),

        vec4(0,.2,0,1),
        vec4(.2,0,0,1),
        vec4(0,0,-.2,1),

        vec4(-.2,.0,.0,1),
        vec4(0,.2,0,1),
        vec4(0,0,-.2,1),

        vec4(0.0,0.0,0.2,1),
        vec4(-.2,.0,.0,1),
        vec4(0,-.2,0,1),

        vec4(0.0,0.0,0.2,1),
        vec4(0,-.2,0,1),
        vec4(.2,0,0,1),

        vec4(0,-.2,0,1),
        vec4(.2,0,0,1),
        vec4(0,0,-.2,1),

        vec4(-.2,.0,.0,1),
        vec4(0,-.2,0,1),
        vec4(0,0,-.2,1)

    ];

    // Every face on the octahedron is divided into two triangles
    // Each triangle is described by three indices
    // Into the array "vertices"

    var indexListP =[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  
    var textureCoordinates =
       [// Front
        0.0,  0.0,
        0.5,  1.0,
        1.0,  0.0,
        // Front
        0.0,  0.0,
        0.5,  1.0,
        1.0,  0.0,
        // Front
        0.0,  0.0,
        0.5,  1.0,
        1.0,  0.0,
        // Front
        0.0,  0.0,
        0.5,  1.0,
        1.0,  0.0,
        // Front
        0.0,  0.0,
        0.5,  1.0,
        1.0,  0.0,
        // Front
        0.0,  0.0,
        0.5,  1.0,
        1.0,  0.0,
        // Front
        0.0,  0.0,
        0.5,  1.0,
        1.0,  0.0,
        // Front
        0.0,  0.0,
        0.5,  1.0,
        1.0,  0.0];
    


    // The following will generate the texture and bind it to the object
    bindTexture();

    // Code here to handle putting above lists into buffers
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesP), gl.STATIC_DRAW );

    var myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );

    // will populate to create buffer for indices
    var iBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexListP), gl.STATIC_DRAW );

    // Defines texture coords
    var textureVertexbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,textureVertexbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW);
    
    var textureCoordinate = gl.getAttribLocation(myShaderProgram,"a_texcoord");
    gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( textureCoordinate );

    console.log("texture is loaded");

}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureImage);
    gl.uniform1i(gl.getUniformLocation(myShaderProgram, "u_texture"), 0);
    

    if(rotateBool)
        rotate();
    if(scaleBool)
        scale();
    if(translateBool)
        translate();
    if(isSpinning)
        console.log(isSpinning);
        Spinner();

    keyPressed = '\0';
    // will populate to render the polygon
    gl.drawElements( gl.TRIANGLES, 24, gl.UNSIGNED_BYTE, 0 );
    console.log("debug1")
    requestAnimFrame(render);
}

function bindTexture() {
    textureImage = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, textureImage );
    const myImage = new Image();
    var url = "https://live.staticflickr.com/65535/52028150884_7ca39b392b_b.jpg";
    myImage.crossOrigin = "anonymous";

    myImage.onload = function() {
        gl.bindTexture( gl.TEXTURE_2D, textureImage );
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap( gl.TEXTURE_2D ); // only use this if the image is a power of 2
        return textureImage;
    };
    myImage.src = url;
}

function rotate() {
    // rotate the polygon
    if      (keyPressed == 'a')
        alpha -= .1;
    else if (keyPressed == 'd')
        alpha += .1;
    else if (keyPressed == 's')
        beta -= .1;
    else if (keyPressed == 'w')
        beta += .1;
    else if (keyPressed == 'q')
        gamma -= .1;
    else if (keyPressed == 'e')
        gamma += .1;

    alphaLoc= gl.getUniformLocation(myShaderProgram, "alpha");
    gl.uniform1f(alphaLoc, alpha);

    betaLoc= gl.getUniformLocation(myShaderProgram, "beta");
    gl.uniform1f(betaLoc, beta);

    gammaLoc= gl.getUniformLocation(myShaderProgram, "gamma");
    gl.uniform1f(gammaLoc, gamma);

}

function translate() {
    // translates the polygon
    if      (keyPressed == 'a')
        tx -= .03;
    else if (keyPressed == 'd')
        tx += .03;
    else if (keyPressed == 's')
        ty -= .03;
    else if (keyPressed == 'w')
        ty += .03;
    
    txLoc= gl.getUniformLocation(myShaderProgram, "tx");
    gl.uniform1f(txLoc, tx);

    tyLoc= gl.getUniformLocation(myShaderProgram, "ty");
    gl.uniform1f(tyLoc, ty);

    //render();
}

function scale() {
    // scale polygon
    if      (keyPressed == 'a')
        sx -= .1;
    else if (keyPressed == 'd')
        sx += .1;
    else if (keyPressed == 's')
        sy -= .1;
    else if (keyPressed == 'w')
        sy += .1;

    sxLoc= gl.getUniformLocation(myShaderProgram, "sx");
    gl.uniform1f(sxLoc, sx);

    syLoc= gl.getUniformLocation(myShaderProgram, "sy");
    gl.uniform1f(syLoc, sy);

    szLoc= gl.getUniformLocation(myShaderProgram, "sz");
    gl.uniform1f(szLoc, sz);
}

function Spinner() {
    if(isSpinning) {
        alpha += .03;
        beta += .03;
        gamma += .03;

        alphaLoc= gl.getUniformLocation(myShaderProgram, "alpha");
        gl.uniform1f(alphaLoc, alpha);

        betaLoc= gl.getUniformLocation(myShaderProgram, "beta");
        gl.uniform1f(betaLoc, beta);

        gammaLoc= gl.getUniformLocation(myShaderProgram, "gamma");
        gl.uniform1f(gammaLoc, gamma);
    }
}

function checkKey(event) {
    var keyCode = event.keyCode;
    if (keyCode == 65) //a 65 d 68 (x axis) s 83 w 87 (y axis) q 81 e 69 (z axis), use arrow keys for rotate(left 37) , scale (up 38) , or translate (right 39)
        keyPressed = 'a';
    else if (keyCode == 68)
        keyPressed = 'd';
    else if (keyCode == 83)
        keyPressed = 's';
    else if (keyCode == 87)
        keyPressed = 'w';
    else if (keyCode == 81)
        keyPressed = 'q'
    else if (keyCode == 69)
        keyPressed = 'e'
    else if (keyCode == 37)
        rotateBool = !rotateBool;
    else if (keyCode == 38)
        scaleBool = !scaleBool;
    else if (keyCode == 39)
        translateBool = !translateBool;
    else if (keyCode == 32)
        isSpinning = !isSpinning;

}