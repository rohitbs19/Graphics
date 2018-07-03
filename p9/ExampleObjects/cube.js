/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Cube = undefined;
var SpinningCube = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Cube = function Cube(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || [1.0,1.0,1.0];
        this.color = color || [.7,.8,.9];
    }
    function createTexture (gl, image, flipY) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

       // gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    Cube.prototype.init = function (drawingState) {
        //extract gl context from the app.js/graphicsTown.js program to maintain consistency in terms of the context
        var gl = drawingState.gl;
        // create the shaders once - for all cubes
        // this is an equivalent for create shader program
        /*
        * this takes care of initializing the vertex shader, fragment shader program,
        * and create a gl program and links the shader appropriately and returns the gl.program
        * context to the shader program var
        *
        * */
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        /*
        *
        * sets the required buffers with attributes
        *  with the required vertices, normals, faces/indices and etc
        *  and takes care of all the buffer related proccesses */
        //if (!buffers) {
        /*var arrays = {
            vpos : { numComponents: 3, data:
                /!*-.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                 .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5 *!/
                emirateTower.vertices
                // x = 1
             },
            vnormal : {numComponents:3, data: emirateTower.normals},


        }*/
        /*
        *
        * create the vertex buffer
        *
        * */
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(emirateTower.vertices), gl.STATIC_DRAW);

        this.vertexAttribLocation = gl.getAttribLocation(shaderProgram.program, 'vpos');

        /*
        * create the index buffer
        *
        * */
        this.indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(emirateTower.indices), gl.STATIC_DRAW);


        /*
        *
        * creating the normal buffer
        *
        * */
        this.normalsBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(emirateTower.normals), gl.STATIC_DRAW);

        this.normalsAttribLocation = gl.getAttribLocation(shaderProgram.program, 'vnormal');

        /*
        * creating the texture buffer and stuff
        *
        * */
        this.TexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.TexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(emirateTower.texCoords), gl.STATIC_DRAW);
        this.textureAttribLocation = gl.getAttribLocation(shaderProgram.program, 'vertTexCoord');
        //passes the array created above
        //buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        //}
        this.midTexture = createTexture(gl, document.getElementById('MasterPiece'), true);

    };
    /*
    * the draw function for drawing the cubes depending on the drawingState
    *
    * different twgl methods have been used to scale, translate and etc,
    *
    * uses the appropriate program
    * the set bufferandAttributes method maps the passed buffers and the apt program and maps them to the relevant
    * vertex attributes mentioned in the shader program. instead of declaring various attribute locations.
    * and tell the gpu the required information to connect the buffers. a lot of code gets condensed because of this
    *
    * set uniforms also does a similar things as above but for uniforms in the shader programs
    * QUESTION: I wonder how the change in the order of the parameter would have an impact on the program
    *
    * twgl.drawBufferInfo method takes care of the drawing of the state
    * */
    Cube.prototype.draw = function (drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size[0], this.size[1], this.size[2]]);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        //twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection,
            cubecolor: this.color, model: modelM
        });

        /*
        * vertex attrib pointer stuff
        *
        * */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        gl.vertexAttribPointer(
            this.vertexAttribLocation,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.vertexAttribLocation);


        /*
        *
        * do attrib pointer stuff for normals
        * */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);

        gl.vertexAttribPointer(
            this.normalsAttribLocation,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.normalsAttribLocation);

        /*
        *
        * do the tex attrib pointer stuff for GPU
        *
        * */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.TexBuffer);
        gl.vertexAttribPointer(
            this.textureAttribLocation,
            2,
            gl.FLOAT,
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0,
        );
        gl.enableVertexAttribArray(this.textureAttribLocation);


        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // come to the texture context
        gl.bindTexture(gl.TEXTURE_2D, this.midTexture);
        /*
        * activate the given texture probably for the sampler uniform
        *
        * */
        gl.activeTexture(gl.TEXTURE0);

        //bind buffer for the indices before the draw statement
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, emirateTower.indices.length, gl.UNSIGNED_SHORT, 0);
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        //twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };

    Cube.prototype.center = function(drawingState) {
        return this.position;
    }


    ////////
    // constructor for Cubes
    SpinningCube = function SpinningCube(name, position, size, color, axis) {
        // creates a normals cube using the contructor defined above and makes use of the additional information
        // passed as the argument
        Cube.apply(this,arguments);
        this.axis = axis || 'X';
    }

    //orginates from the earlier cube context
    SpinningCube.prototype = Object.create(Cube.prototype);
    //uses draw method of its own to enable spinning
    SpinningCube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        //probably supplant this part of the transformations code using the transformations functions in
        // gl-matrix and pretty much follow the same process other than create some cases for various axes the
        // the cube is supposed to rotate
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/200.0;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    SpinningCube.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
/*grobjects.push(new Cube("cube1",[-2,0.5,   0],1) );
grobjects.push(new Cube("cube2",[ 2,0.5,   0],1, [1,1,0]));
grobjects.push(new Cube("cube3",[ 0, 0.5, -2],1 , [0,1,1]));*/
//grobjects.push(new Cube("cube4",[ -3,1.4,   1],[1,1.5,1.0]));
/*
grobjects.push(new SpinningCube("scube 1",[-2,0.5, -2],1) );
grobjects.push(new SpinningCube("scube 2",[-2,0.5,  2],1,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 3",[ 2,0.5, -2],1 , [0,0,1], 'Z'));
grobjects.push(new SpinningCube("scube 4",[ 2,0.5,  2],1));
*/
