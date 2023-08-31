var gl;
var shaderProgramSquare;
var thetaAnim;
var stopStartFlag;

var tx;
var ty;
var mousetx;
var mousety;


var direction; //direction for drift

var thetaUniform;
var MUniform;
var MValue;
var globalSpeed;

function init() {
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    // Set up the viewport
    gl.viewport( 0, 0, 512, 512 );   // x, y, width, height
    
    // Set up the background color
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
    
    shaderProgramSquare = initShaders( gl, "vertex-shader-square",
                                      "fragment-shader-square" );
    gl.useProgram( shaderProgramSquare );
    
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );

    stopStartFlag = 0;
    thetaAnim = 0.0; //initialize your angle
    thetaUniform = gl.getUniformLocation( shaderProgramSquare, "theta" );
    //gl.uniform1f(thetaUniform, thetaAnim);    

    MValue = [1.0, 
    0.0, 
    0.0, 
    1.0]; //This is being read off as columns, this is the identity matrix
    MUniform = gl.getUniformLocation( shaderProgramSquare, "M'");
    gl.uniformMatrix2fv(MUniform, false , MValue); //uniform Mat 2 f(float) v(taking in values) - false means you don't want to transpose it
    
    var sxValue = 2.0;
    var syValue = 0.5;
    globalSpeed = 0.1; //speed multiplier;
    direction = 'd';
    mousetx = 0.0; //mouse
    mousety = 0.0;
    tx = 0.0; //keyboard
    ty = 0.0;
    /*MValue = [1.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    1.0];
    gl.uniformMatrix3fv(MUniform, false, MValue);*/

    setupPolygon();

    requestAnimFrame( Render );

    //setInterval( Render, 30 ); //Swaps the buffer at the specified millisecond amount
    
}

function setupPolygon() {
    
    // Enter array set up code here
    var p0 = vec2( .2, .2 );
    var p1 = vec2( -.2, .2 );
    var p2 = vec2( -.2, -.2 );
    var p3 = vec2( .3, -.2 );
    var p4 = vec2( .2, -.3);
    var p5 = vec2( .3, -.4);
    var p6 = vec2( .7, -.5);
    var p7 = vec2( .5, -.7);
    var arrayOfPoints = [p0, p1, p2, p3, p4, p5, p6, p7];
    
    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionAttribute = gl.getAttribLocation( shaderProgramSquare, "myPosition" );
    gl.vertexAttribPointer( myPositionAttribute, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionAttribute );    
}

function moveSquare( event ) {
    idle = false;
    var canvasX = event.clientX;
    var canvasY = event.clientY;

    var mousetx = 2.0 * canvasX/512.0 - 1;
    var mousety = - 2.0 * canvasY/512.0 + 1; 

    tx = -mousetx;
    ty = mousety;

}

function moveSquareKeys( event ) {
    idle = false;
    var theKeyCode = event.keyCode; //Gives you the ASCII code of your key press
    //var offset = .03;
    if ( theKeyCode == 65 ) {
        //tx += offset;
        direction = 'a';
    } else if ( theKeyCode == 68 ) {
        //tx -= offset;
        direction = 'd';
    } else if ( theKeyCode == 87 ) {
        //ty += offset;
        direction = 'w';
    } else if ( theKeyCode == 83 ) {
        //ty -= offset;
        direction = 's';
    }

}


function stopStart() {
    if (stopStartFlag == 1) {
        stopStartFlag = 0;
    } else {
        stopStartFlag = 1;
    }
}

function increaseSpeed() {
    globalSpeed += 0.05;
}

function decreaseSpeed() {
    if(globalSpeed > 0.0) {
        globalSpeed -= 0.05;
    }
}

function Render() {

    thetaUniform = gl.getUniformLocation( shaderProgramSquare, "theta" );
    gl.uniform1f( thetaUniform, thetaAnim );
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 8 );
    thetaAnim += (0.05*globalSpeed) * stopStartFlag;

    if(direction == 'a') {
        console.log(tx);
        console.log("bruh" + mousetx);
        if(tx < 1) {
            tx += 0.02*globalSpeed;
        } else {
            direction = 'd';
        }
        
    } else if(direction == 'd') {
        if(tx > -1) {
            tx -= 0.02*globalSpeed;
        } else {
            direction = 'a';
        }
    } else if(direction == 'w') {
        if(ty < 1) {
            ty += 0.02*globalSpeed;
        } else {
            direction = 's';
        }
    } else if(direction == 's') {
        if(ty > -1) {
            ty -= 0.02*globalSpeed;
        } else {
            direction = 'w';
        }
    }
    
    var mouseCoordinatesUniform = gl.getUniformLocation( shaderProgramSquare, "mouseCoordinates" );
    gl.uniform2f( mouseCoordinatesUniform, tx, ty);


    //sxValue += (.01 * stopStartFlag);

    /*MValue = [sxValue,
    .0,
    .0,
    syValue]; */

    MValue = [ Math.cos( thetaAnim ), 
    -Math.sin( thetaAnim ), 
    Math.cos( thetaAnim ), 
    Math.sin( thetaAnim)]; //This is being read off as columns, this is the rotation matrix
    gl.uniformMatrix2fv(MUniform, false, MValue)

    requestAnimFrame( Render );
}
