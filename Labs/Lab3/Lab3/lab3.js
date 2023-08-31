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


    //Vertices of Octahedron
    var vertices = [vec4(0,.0,.2,1), // p0
                    vec4(-.2,.0,.0,1), // p1
                    vec4(0,.2,0,1),   // p2
                    vec4(0,-.2,0,1),  // p3
                    vec4(.2,0,0,1),   // p4
                    vec4(0,0,-.2)];   // p5

    // Colors at Vertices of Octahedron
    var vertexColors = [vec4( 1.0, 0.3, 0.0, 1.0), // p0
                        vec4( 0.5, 0.5, 0.1, 1.0), // p1
                        vec4( 0.4,   1.0, 0.0, 1.0), // p2
                        vec4( 0.3,   0.5, 0.8, 1.0), // p3
                        vec4( 0.7, .0, 1.0, 1.0), // p4
                        vec4( 0,   1.0, 0.7, 1.0)];// p5 

    // Every face on the octahedron is divided into two triangles
    // Each triangle is described by three indices
    // Into the array "vertices"
    var indexList = [0, 3, 1,
                     0, 1, 2,
                     0, 2, 4,
                     0, 4, 3,
                     4, 5, 3,
                     3, 5, 1,
                     1, 5, 2,
                     2, 5, 4];

    // Code here to handle putting above lists into buffers
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );
    
    var myColor = gl.getAttribLocation( myShaderProgram, "myColor" );
    gl.vertexAttribPointer( myColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myColor );
    
    // will populate to create buffer for indices
    var iBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexList), gl.STATIC_DRAW );


}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

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
    requestAnimFrame(render);
   
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