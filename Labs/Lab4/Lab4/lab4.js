// Name: Alif Jakir, jakirab@clarkson.edu
var gl;
var numVertices;
var numTriangles;
var myShaderProgram;
var orthographicIsOn;

var light1Flag;
var light2Flag;

var RotationMatrix;
var RotMFlag;

var toggleSpecularity;

function initGL(){
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.enable(gl.DEPTH_TEST);
    gl.viewport( 0, 0, 512, 512 );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );

    numVertices = 2440;
    numTriangles = 4871;
    vertices = getVertices(); // vertices and faces are defined in object.js
    indexList = getFaces();
    RotMFlag = false;
    
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);
    
    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vertexPosition = gl.getAttribLocation(myShaderProgram,"vertexPosition");
    gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPosition );
    
    var normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        
    var vertexNormal = gl.getAttribLocation(myShaderProgram,"vertexNormal");
    gl.vertexAttribPointer( vertexNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexNormal );
    
    console.log(vertexPosition);
    console.log(vertexNormal);
    
    RotationMatrix = 5.0;
    // WORK ON THIS LAB IN TWO ITERATIONS
    // In the first iteration, do Steps 1 and 2 (i.e., do the Viewing portion)
    // and try to determine if you can see a silhouette (i.e., a filled outline)
    // of the chair. You will not see any inner detail, but you will at least know
    // that the chair is within the viewport. Make sure while doing this step
    // to apply the modelview and projection matrices in the vertex shader
    
    // In the second iteration, do Steps 3.1 (normal calculation and light setup), 3.2 (vertex
    // shader calculations for lighting, and steps 3.3 (fragment shader calculations
    // for lighting) so you can see the inner detail of the chair
    
    // FOLLOWING LINES IN STEPS 1 AND 2 NEED CODE FOR EACH COMMENT
    
    
    // Step 1: Position the camera using the look at method
    
    // Define eye (use vec3 in MV.js)
    var eye = vec3( 100.0, 100.0, -100.0 ); 

    // Define at point (use vec3 in MV.js)
    var at = vec3( 0.0, 0.0, 0.0 );

    // Define vup vector (use vec3 in MV.js)
    var vup = vec3( 0.0, 1.0, 0.0 );

    // Obtain n (use subtract and normalize in MV.js)
    var n = normalize( vec3( eye[0]-at[0], eye[1]-at[1], eye[2]-at[2] ) );

    // Obtain u (use cross and normalize in MV.js)
    var u = normalize( cross( vup, n ) );

    // Obtain v (use cross and normalize in MV.js)
    var v = normalize( cross( n, u ) );

    // Set up Model-View matrix M and send M as uniform to shader
    var M = [u[0],
            v[0],
            n[0],
            .0,
            u[1],
            v[1],
            n[1],
            .0,
            u[2],
            v[2],
            n[2],
            .0,
            -dot( eye, u ),
            -dot( eye, v ),
            -dot( eye, n ),
            1.0];

    var Minvt = [u[0],
            v[0],
            n[0],
            eye[0],
            u[1],
            v[1],
            n[1],
            eye[1],
            u[2],
            v[2],
            n[2],
            eye[2],
            .0,
            .0,
            .0,
            1.0]; 

    // Step 2: Set up orthographic and perspective projections
    
    // Define left plane
    // Define right plane
    // Define top plane
    // Define bottom plane
    // Define near plane
    // Define far plane

    leftPlane  = -50.0;
    rightPlane =  50.0;

    topPlane    =  50.0;
    bottomPlane = -50.0;

    nearPlane =  90.0;
    farPlane  = 200.0;
    
    // Set up orthographic projection matrix P_orth using above planes
    P_orth = [2.0/(rightPlane-leftPlane),
                .0,
                .0,
                .0,
                .0,
                2.0/(topPlane-bottomPlane),
                .0,
                .0,
                .0,
                .0,
                -2.0/(farPlane-nearPlane),
                .0,
                -(rightPlane+leftPlane)/(rightPlane-leftPlane),
                -(topPlane+bottomPlane)/(topPlane-bottomPlane),
                -(farPlane+nearPlane)/(farPlane-nearPlane),
                1.0];
    
    // Set up perspective projection matrix P_persp using above planes
    P_persp = [2.0*nearPlane/(rightPlane-leftPlane),
                .0,
                .0,
                .0,
                .0,
                2.0*nearPlane/(topPlane-bottomPlane),
                .0,
                .0,
                (rightPlane+leftPlane)/(rightPlane-leftPlane),
                (topPlane+bottomPlane)/(topPlane-bottomPlane),
                -(farPlane+nearPlane)/(farPlane-nearPlane),
                -1.0,
                .0,
                .0,
                -2.0*farPlane*nearPlane/(farPlane-nearPlane),
                .0];
    
    // Use a flag to determine which matrix to send as uniform to shader
    // flag value should be changed by a button that switches between
    // orthographic and perspective projections
    orthographicIsOn = 0;
    
    var Pouniform = gl.getUniformLocation(myShaderProgram, "P_orth");
    gl.uniformMatrix4fv( Pouniform, false, P_orth );
    var Ppuniform = gl.getUniformLocation(myShaderProgram, "P_persp");
    gl.uniformMatrix4fv( Ppuniform, false, P_persp );
    
    // Step 3.1: Normals for lighting calculations
    
    // Create face normals using faces and vertices by calling getFaceNormals
    var faceNormals = getFaceNormals( vertices, indexList, numTriangles );
    
    // Create vertex normals using faces, vertices, and face normals
    // by calling getVertexNormals
    var vertexNormals = getVertexNormals( vertices, indexList, faceNormals, numVertices, numTriangles );
    
    // Following code sets up the normals buffer (NOTE: THERE IS AN INTENTIONAL
    // MISTAKE HERE, YOU WILL NEED TO FIND IT AND FIX IT!!)
    var normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexNormals), gl.STATIC_DRAW);
    
    var vertexNormal = gl.getAttribLocation(myShaderProgram,"vertexNormal");
    gl.vertexAttribPointer( vertexNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexNormal );
    
    // Set up coefficients for the object
    // (ambient coefficients, diffuse coefficients,
    // specular coefficients, shininess)
    // and send them as uniform variables to the shader program (NEEDS CODE)
    var p0 = [ 0.0, 20.0, -20.0 ];

    var Ia = [ .8, .8, .8 ];
    var Id = [ .8, .8, .8 ];
    var Is = [ .8, .8, .8 ];

    var ka = [.5, .5, .5];
    var kd = [.5, .5, .5];
    var ks = [1.0, 1.0, 1.0];

    var alpha = 4.0;

    var p0loc = gl.getUniformLocation( myShaderProgram, "p0" );
    var Ialoc = gl.getUniformLocation( myShaderProgram, "Ia" );
    var Idloc = gl.getUniformLocation( myShaderProgram, "Id" );
    var Isloc = gl.getUniformLocation( myShaderProgram, "Is" );
    var kaloc = gl.getUniformLocation( myShaderProgram, "ka" );
    var kdloc = gl.getUniformLocation( myShaderProgram, "kd" );
    var ksloc = gl.getUniformLocation( myShaderProgram, "ks" );
    var alphaloc = gl.getUniformLocation( myShaderProgram, "alpha" );

    // Set up the first light source and send the variables
    // to the shader program (NEEDS CODE, VARIABLES DEPEND ON LIGHT TYPE)
    gl.uniform1f( alphaloc, alpha );
    gl.uniform3fv( p0loc, p0 );
    gl.uniform3fv( Ialoc, Ia );
    gl.uniform3fv( Idloc, Id );
    gl.uniform3fv( Isloc, Is );
    gl.uniform3fv( kaloc, ka );
    gl.uniform3fv( kdloc, kd );
    gl.uniform3fv( ksloc, ks );
    
    // Set up the second light source and send the variables
    // to the shader program (NEEDS CODE, VARIABLES DEPEND ON LIGHT TYPE)
    var p1 = [ 0.0, -20.0, -20.0 ];

    var Ia1 = [ .8, .8, .8 ];
    var Id1 = [ .6, .6, .6 ];
    var Is1 = [ .7, .7, .7 ];

    var p1Handle = gl.getUniformLocation( myShaderProgram, "p1" );
    var Ia1Handle = gl.getUniformLocation( myShaderProgram, "Ia1" );
    var Id1Handle = gl.getUniformLocation( myShaderProgram, "Id1" );
    var Is1Handle = gl.getUniformLocation( myShaderProgram, "Is1" );

    gl.uniform3fv( p1Handle, p1 );
    gl.uniform3fv( Ia1Handle, Ia1 );
    gl.uniform3fv( Id1Handle, Id1 );
    gl.uniform3fv( Is1Handle, Is1 );

    // Initialize up on/off flags for the both light sources. These
    // flags should be controlled using buttons
    light1Flag = 1.0;
    light2Flag = 1.0;
    toggleSpecularity = 1.0;

    var p0Handle = gl.getUniformLocation(myShaderProgram,"light1F");
    gl.uniform1f(p0Handle,light1Flag);
    var p1Handle = gl.getUniformLocation(myShaderProgram,"light2F");
    gl.uniform1f(p1Handle,light2Flag);
    var togSpecHandle = gl.getUniformLocation(myShaderProgram,"togS");
    gl.uniform1f(togSpecHandle,toggleSpecularity);
    
    // You will need to have an additional uniform variable for the
    // modelview inverse transpose that gets applied to the vertex normal.
    // Figure out the modelview inverse transpose and send it to the
    // shader program as a uniform (NEEDS CODE)
    
    var Muniform = gl.getUniformLocation(myShaderProgram, "modelview");
    gl.uniformMatrix4fv( Muniform, false, M );
    var Minvtuniform = gl.getUniformLocation(myShaderProgram, "Minvt");
    gl.uniformMatrix4fv( Minvtuniform, false, Minvt );

    // render the object
    drawObject();

};

// This function gets the normals of the faces
function getFaceNormals( vertices, indexList, numTriangles ) {
    // array of face normals
    var faceNormals = [];
    var faceNormal = [];
    // Following lines iterate over triangles
    for (var i = 0; i < numTriangles; i++) {
        // Following lines give you three vertices for each face of the triangle
        var p0 = vec3( vertices[indexList[3*i]][0],
                      vertices[indexList[3*i]][1],
                      vertices[indexList[3*i]][2]);
        var p1 = vec3( vertices[indexList[3*i+1]][0],
                      vertices[indexList[3*i+1]][1],
                      vertices[indexList[3*i+1]][2]);
        var p2 = vec3( vertices[indexList[3*i+2]][0],
                      vertices[indexList[3*i+2]][1],
                      vertices[indexList[3*i+2]][2]);
        // Calculate vector from p0 to p1 ( use subtract function in MV.js, NEEDS CODE )
        var v01 = vec3( p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2] );
        // Calculate vector from p0 to p2 ( use subtract function, NEEDS CODE )
        var v02 = vec3( p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2] );
        // Calculate face normal as the cross product of the above two vectors
        // (use cross function in MV.js, NEEDS CODE )
        // normalize face normal (use normalize function in MV.js, NEEDS CODE)
        var faceNormal = normalize( cross( v01, v02 ) );
        // Following line pushes the face normal into the array of face normals
        faceNormals.push( faceNormal );
    }
    // Following line returns the array of face normals
    return faceNormals;
}

// This gives you the vertex normals for each vertex
function getVertexNormals( vertices, indexList, faceNormals, numVertices, numTriangles ) {
    var vertexNormals = [];
    // Iterate over all vertices
    for ( var j = 0; j < numVertices; j++) {
        // Initialize the vertex normal for the j-th vertex
        var vertexNormal = vec3( 0.0, 0.0, 0.0 );
        // Iterate over all the faces to find if this vertex belongs to
        // a particular face
        for ( var i = 0; i < numTriangles; i++ ) {
            var i0 = indexList[3*i];
            var i1 = indexList[3*i+1];
            var i2 = indexList[3*i+2];
            // The condition of the following if statement should check
            // if the j-th vertex belongs to the i-th face
            if ( j == i0 || j == i1 || j == i2 ) {
                vertexNormal[0] = vertexNormal[0] + faceNormals[i][0];
                vertexNormal[1] = vertexNormal[1] + faceNormals[i][1];
                vertexNormal[2] = vertexNormal[2] + faceNormals[i][2];                
            }
        }
        // Normalize the vertex normal here (NEEDS CODE)
        vertexNormal = normalize( vertexNormal );
        // Following line pushes the vertex normal into the vertexNormals array
        vertexNormals.push( vertexNormal );
    }
    return vertexNormals;
}

// Call this function to draw the object repeatedly
function drawObject() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );

    // Will rotate the light if the flag is set by the button
    if(RotMFlag)RotationMatrix+=.01;
    rotLocation = gl.getUniformLocation(myShaderProgram,"RotM");
    gl.uniform1f(rotLocation,RotationMatrix);

    requestAnimFrame(drawObject); //helps to render interactions with buttons
}

// Write a script for changing the perspective / orthographic flag
// using a button here
function showOrthographic() {
    orthographicIsOn = 1;
    orthographicIsOnLocation = gl.getUniformLocation(myShaderProgram,"orthIsOn");
    gl.uniform1f(orthographicIsOnLocation,orthographicIsOn);
    console.log("orth");
}

function showPerspective() {
    orthographicIsOn = 0;
    orthographicIsOnLocation = gl.getUniformLocation(myShaderProgram,"orthIsOn");
    gl.uniform1f(orthographicIsOnLocation,orthographicIsOn);
    console.log("persp");
}

// Write a script for switching on / off the first light source flag
// using a button here
function toggleLight1(){
    if(light1Flag == 0.0){
        light1Flag = 1.0;
    }
    else{
        light1Flag = 0.0;
    }
    var p0Handle = gl.getUniformLocation(myShaderProgram,"light1F");
    gl.uniform1f(p0Handle,light1Flag);
}

// Write a script for switching on / off the second light source flag
// using a button here
function toggleLight2(){
    if(light2Flag == 0.0){
        light2Flag = 1.0;
    }
    else{
        light2Flag = 0.0;
    }
    var p1VC = gl.getUniformLocation(myShaderProgram,"light2F");
    gl.uniform1f(p1VC,light2Flag);
}

// This toggles the specularity
function toggleSpecular(){
    if(toggleSpecularity == 0.0){
        toggleSpecularity = 1.0;
    }
    else{
        toggleSpecularity = 0.0;
    }
    var togSpecHandle = gl.getUniformLocation(myShaderProgram,"togS");
    gl.uniform1f(togSpecHandle,toggleSpecularity);
}

// This makes the point light rotate
function moveShape(){
    RotMFlag = !RotMFlag;
}



