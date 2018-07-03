
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var planet = undefined;


// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";


    var shaderProgram = undefined;


    // constructor for planet
    planet = function planet(name, position, size, obj, img,img2) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || [1.0, 1.0, 1.0];
        this.mercuryMesh = obj.meshes[0];
        this.img = img;
        this.img2 = img2;
       // this.color = color || [.7, .8, .9, 0.0];
    };





    function createTexture (gl, image, flipY) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);

        // gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    planet.prototype.init = function (drawingState) {
        //extract gl context from the app.js/graphicsTown.js program to maintain consistency in terms of the context
        var gl = drawingState.gl;

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["planet-vs", "planet-fs"]);
        }

        /*
        * import the map from the mercury.js file
        *
        * */

        /*
        *
        * create the vertex buffer
        *
        * */
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mercuryMesh.vertices), gl.STATIC_DRAW);
        this.vertexAttribLocation = gl.getAttribLocation(shaderProgram.program, 'vpos');

        /*
        * create the index buffer
        *
        * */
        this.indexBuffer = gl.createBuffer();
        this.meshFaces = [].concat.apply([], this.mercuryMesh.faces);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.meshFaces), gl.STATIC_DRAW);


        /*
        *
        * creating the normal buffer
        *
        * */
        this.normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mercuryMesh.normals), gl.STATIC_DRAW);
        this.normalsAttribLocation = gl.getAttribLocation(shaderProgram.program, 'vnormal');

        /*
       *
       * tangent buffer
       *
       * */
        this.tangentBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mercuryMesh.tangents), gl.STATIC_DRAW);
        this.tangentAtrribLocation = gl.getAttribLocation(shaderProgram.program, 'vtangent');


        /*
        * creating the texture buffer and stuff
        *
        * */
        this.TexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.TexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mercuryMesh.texturecoords[0]), gl.STATIC_DRAW);
        this.textureAttribLocation = gl.getAttribLocation(shaderProgram.program, 'vtex');
        /*
        *
        * initializing the given textures
        *
        * */
        this.midTexture_1 = createTexture(gl, document.getElementById(this.img), true);
        this.midTexture_Norm = createTexture(gl, document.getElementById(this.img2), true);


         this.usamplerLocation = gl.getUniformLocation(shaderProgram.program, "uSampler");
         this.normalSamplerLocation = gl.getUniformLocation(shaderProgram.program, "normalSampler");



    };

    planet.prototype.draw = function (drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size[0], this.size[1], this.size[2]]);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        var VM_Matrix = twgl.m4.create();
        /*
        * produces the new model view matrix from model and view matrices
        * */
        twgl.m4.multiply(modelM,drawingState.view,VM_Matrix);

        /*
        * create the Normal matrix to send it as uniform
        * */

        var normalMatrix = twgl.m4.create();
        var inverseMatrix = twgl.m4.create();
        twgl.m4.inverse(VM_Matrix, inverseMatrix);
        twgl.m4.transpose(inverseMatrix, normalMatrix);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us


        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        //twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);


        /*
        * set uniforms with the appropriate values
        * */
        twgl.setUniforms(shaderProgram, {
            modelView: VM_Matrix,
            proj: drawingState.proj,
            normalMatrix: normalMatrix,
            uLightPosition: drawingState.sunDirection,
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
        * vertex attrib array for tangents
        *
        * */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
        gl.vertexAttribPointer(
            this.tangentAtrribLocation,
            3,gl.FLOAT, gl.FALSE,
            0,
            0
        );
        gl.enableVertexAttribArray(this.tangentAtrribLocation);
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
            0,
            0,
        );
        gl.enableVertexAttribArray(this.textureAttribLocation);
        // come to the texture context

        //gl.bindBuffer(gl.ARRAY_BUFFER, this.TexBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.midTexture_1);
        gl.uniform1i(this.usamplerLocation, 0);

        /*
        * 2nd texture
        *
        * */
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.midTexture_Norm);
        gl.uniform1i(this.normalSamplerLocation, 1);


        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //bind buffer for the indices before the draw statement
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.meshFaces.length, gl.UNSIGNED_SHORT, 0);


        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        //twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };

    planet.prototype.center = function(drawingState) {
        return this.position;
    }


})();

grobjects.push(new planet("mercury", [4, 0.4, 4], [0.3, 0.3, 0.3], modHouse, "ModernHouseTexture", "HouseNormalTexture"));
grobjects.push(new planet("mercury", [3, 4, -10], [0.3, 0.3, 0.3], mercury, "MercuryTexture", "MercuryNormalTexture"));

