/*
*
*
* 1: constructing from the already textured cube and turn it to the two model which reflects itself
* 2: this is an sample build to see how the two pass works
* 3: then depending on the challenges observed here explore new methods in which this could be explored.
*
*
* */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var twoPassCube = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    twoPassCube = function twoPassCube(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || [1.0, 1.0, 1.0];
        this.color = color || [.7, .8, .9];
    };

    /*
    *
    * HELPER function which initializes a texture the webgl way
    *
    * */
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



    /*
    *
    * inits all the buffers and attribs and uniforms
    *
    * */
    twoPassCube.prototype.init = function (drawingState) {
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

        /*
        * get the initialized texture with the respective properties from the helper function
        *
        * */
        this.midTexture = createTexture(gl, document.getElementById('MasterPiece'), true);

        /*
        * set up a texture (initially blank) to bind to the framebuffer object
        *
        * */
        this.FBtexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.FBtexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            512, 512,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);


        /*
        *
        * create framebuffer and attach the above frame buffer texture created
        *
        * */
        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.FBtexture, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); /* to restore it to the onscreen rendering part*/

        console.log(drawingState.view);
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
    twoPassCube.prototype.draw = function (drawingState) {
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

        /*
        *
        * up until this point the attributes and all the stuff related to the values
        * to be sent for the shaders is done.
        *
        * 1: draw for the Frame Buffer first and
        * 2: then draw onto the onscreen
        *
        *
        * */

        /*
        * FIRST PASS DRAW TO THE FRAME BUFFER
        * */
        //gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        //clear screen as we normally do
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.disable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        //BIND texture
        gl.bindTexture(gl.TEXTURE_2D, this.midTexture);

        //DRAW the triangles into the FB
        gl.drawElements(gl.TRIANGLES, emirateTower.indices.length, gl.UNSIGNED_SHORT, 0);

        /*
        *
        * SECOND PASS
        *
        * */

        //gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // come to the texture context
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        //gl.clearColor(1.0, 1.0, 1.0, 1.0);
         gl.enable(gl.DEPTH_TEST);
         //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //gl.bindTexture(gl.TEXTURE_2D, this.midTexture);
        /*
        * activate the given texture probably for the sampler uniform
        *
        * */

        gl.bindTexture(gl.TEXTURE_2D, this.FBtexture);
        //bind buffer for the indices before the draw statement
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, emirateTower.indices.length, gl.UNSIGNED_SHORT, 0);

    };

    twoPassCube.prototype.center = function(drawingState) {
        return this.position;
    }



})();

grobjects.push(new twoPassCube("cube4",[ -3,1.4,   1],[1,1.5,1.0]));
