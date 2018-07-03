
var grobjects = grobjects || [];


var flyingObj = undefined;
var currSpotlightPos = [0, 0, 0];

(function () {

    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var droneBuffers = undefined;
    var texture = null;
    var normalMap = null;
    var returnArrays;

    flyingObj = function flyingObj(name) {
        this.name = name;
        this.position = [0, 4, 0];
        this.target = [0, 0, 0];

        this.color = [1, 1, 1];

        this.orientation = 0;
        this.texture = null;
        this.curve1 = new HermiteCurve([[0, 2, -25], [-16, 3, 0], [45, 0, 0], [0, 0, 27]]);
        this.curve2 = new HermiteCurve([[-28, 2.5, 0], [0, 5, 16], [0, 0, 25], [50, 0, 0]]);
        this.curve3 = new HermiteCurve([[0, 5, 16], [16, 7.5, 0], [50, 0, 0], [0, 0, 25]]);
        this.curve4 = new HermiteCurve([[16, 8, 0], [0, 1, -20], [0, 0, 25], [50, 0, 0]]);
        this.texture = null;
        this.normalMap = null;
    };

    function convertToFloatArrays() {
        var mesh = planeMesh.meshes[0];
        returnArrays = [
            new Float32Array(mesh.vertices),
            new Float32Array(mesh.normals),
            new Uint16Array([].concat.apply([], mesh.faces)),
            new Float32Array(mesh.texturecoords[0])
        ];
    }

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
    flyingObj.prototype.init = function(drawingState) {
        var gl=drawingState.gl;



        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        convertToFloatArrays();

        var meshes = planeMesh.meshes[0];


        /*
      *
      * create the vertex buffer
      *
      * */
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshes.vertices), gl.STATIC_DRAW);
        this.vertexAttribLocation = gl.getAttribLocation(shaderProgram.program, 'vpos');

        /*
        * create the index buffer
        *
        * */
        this.indexBuffer = gl.createBuffer();
        this.meshFaces = [].concat.apply([], meshes.faces);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.meshFaces), gl.STATIC_DRAW);


        /*
        *
        * creating the normal buffer
        *
        * */
        this.normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshes.normals), gl.STATIC_DRAW);
        this.normalsAttribLocation = gl.getAttribLocation(shaderProgram.program, 'vnormal');


        /*
        *
        * creating the tex stuff
        *
        * */
        this.textureBuffer1 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer1);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshes.texturecoords[0]), gl.STATIC_DRAW);
        this.textureAttribLocation = gl.getAttribLocation(shaderProgram.program, 'vertTexCoord');

        this.planeTexture = createTexture(gl, document.getElementById('PlaneTexture'), true);
        /*
        * creating the texture buffer and stuff
        * IGNORING TEXTURE FOR THE TIME BEING
        * */

    };
    flyingObj.prototype.draw = function(drawingState) {

        advance(this,drawingState);

        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.rotationY(this.orientation + Math.PI);
        modelM = twgl.m4.multiply(twgl.m4.scaling([0.01, 0.01, 0.01]), modelM);
        modelM = twgl.m4.multiply(twgl.m4.rotationX(0), modelM);
        //twgl.m4.setTranslation(modelM,this.position,modelM);
        modelM = twgl.m4.multiply(modelM, twgl.m4.lookAt(this.position, this.target, [0, 1, 0]));
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
            lightdir:drawingState.sunDirection,
            cubecolor:this.color,
            model: modelM,

        });


        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(
            this.vertexAttribLocation,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.vertexAttribLocation);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.vertexAttribPointer(
            this.normalsAttribLocation,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.normalsAttribLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer1);
        gl.vertexAttribPointer(
          this.textureAttribLocation,
          2,gl.FLOAT, gl.FALSE,
            0,0
        );
        gl.enableVertexAttribArray(this.textureAttribLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, this.planeTexture);
        gl.activeTexture(gl.TEXTURE0);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, [].concat.apply([], planeMesh.meshes[0].faces).length, gl.UNSIGNED_SHORT, 0);


    };
    flyingObj.prototype.center = function (drawingState) {
        return this.position;
    };

    function advance(plane, drawingState) {

        currSpotlightPos = plane.position;
        if (plane.t < 1) {
            plane.position = plane.curve1.value(plane.t);
            plane.target = plane.curve1.dtValue(plane.t);
        }
        else if (plane.t >= 1 && plane.t < 2) {
            plane.position = plane.curve2.value(plane.t - 1);
            plane.target = plane.curve2.dtValue(plane.t - 1);
        }
        else if (plane.t >= 2 && plane.t < 3) {
            plane.position = plane.curve3.value(plane.t - 2);
            plane.target = plane.curve3.dtValue(plane.t - 2);
        }
        else if(plane.t >= 3 && plane.t < 4) {
            plane.position = plane.curve4.value(plane.t - 3);
            plane.target = plane.curve4.dtValue(plane.t - 3);
        }
        else {
            plane.t = 0;
            return;
        }
        plane.t += (drawingState.realtime - plane.lastTime)/3000;
        plane.lastTime = drawingState.realtime;
        return;
    }

})();

grobjects.push(new flyingObj("plane"));

