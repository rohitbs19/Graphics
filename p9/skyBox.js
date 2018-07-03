/**
 * Created by gleicher on 10/17/15.
 */
var grobjects = grobjects || [];

// make the two constructors global variables so they can be used later
var Skybox = undefined;

(function () {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var skyboxBuffers = undefined;
    var texture = null;

    var skybox_posx = document.getElementById('posx2');
    var skybox_negx = document.getElementById('negx2');
    var skybox_posz = document.getElementById('posz2');
    var skybox_negz = document.getElementById('negz2');
    var skybox_posy = document.getElementById('posy2');
    var skybox_negy = document.getElementById('negy2');

    // constructor for Helicopter
    Skybox = function Skybox(name) {
        this.name = name;
        this.position = [0, 0, 0];    // will be set in init
    };
    Skybox.prototype.init = function(drawingState) {
        var gl=drawingState.gl;


        /*
        * create the cubes stuff here
        *
        * */
        /*
        *
        * create the cube program for it to access its own set of shaders
        *
        * */

        this.envmapCubeProgram = twgl.createProgramInfo(gl, ["envCubeVs", "envCubeFs"]).program;

        /*
        * create the  buffers
        *
        * */
        this.envVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.envVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(emirateTower.vertices), gl.STATIC_DRAW);

        this.envIndicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.envIndicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(emirateTower.indices), gl.STATIC_DRAW);

        this.envNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.envNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(emirateTower.normals), gl.STATIC_DRAW);


        /*
        *
        * set the locations for envmapCubeProgram
        *
        * */
        /*
        * atribs
        * */
        this.envmapCubeProgram.attribs = {
            vPos: gl.getAttribLocation(this.envmapCubeProgram, "vpos"),
            vNormals: gl.getAttribLocation(this.envmapCubeProgram,"vnormals")
        };
        /*
        * uniforms
        * */
        this.envmapCubeProgram.uniforms = {
            projection: gl.getUniformLocation(this.envmapCubeProgram, "projection"),
            view: gl.getUniformLocation(this.envmapCubeProgram, "view"),
            invView: gl.getUniformLocation(this.envmapCubeProgram, "invView"),
            model: gl.getUniformLocation(this.envmapCubeProgram, "model"),
        };

        /*
        * this is the gl program for the skybox
        *
        * */
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["skybox-vs", "skybox-fs"]);
        }
        if (!skyboxBuffers) {
            var arrays = cube(80);
            skyboxBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);

            /*
            *
            * texture stuff for all the 6 dirs of the skybox cube
            *
            * */
             this.texID = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texID);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            // Pos X
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_posz);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            // Neg X
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_negx);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            // Pos Z
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_posx);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            // Neg Z
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_negz);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            // Pos Y
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_posy);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            // Neg Y
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skybox_negy);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        }
    };
    Skybox.prototype.draw = function(drawingState) {

        /*
        *
        * draw the sky box first
        *
        * */
        var modelM = twgl.m4.identity();

        twgl.m4.setTranslation(modelM,twgl.m4.transformPoint(drawingState.camera, [0, 0, 0]),modelM);

        var gl = drawingState.gl;
        /*
        * using the skybox program
        *
        * */
        gl.useProgram(shaderProgram.program);
        gl.enable(gl.DEPTH_TEST);
        twgl.setUniforms(shaderProgram,{
            projection:drawingState.proj,
            modelview: drawingState.view,
            modelM: modelM
        });
        twgl.setBuffersAndAttributes(gl,shaderProgram,skyboxBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, skyboxBuffers);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        /*
        *
        * now draw the envmapped cube using its respective program
        *
        * */

        gl.useProgram(this.envmapCubeProgram);

        var model2 = twgl.m4.identity();

        twgl.m4.setTranslation(model2, [-3, 1.3, -2.0], model2);
        twgl.m4.scale(model2, [1, 1.37, 1], model2);
        gl.uniformMatrix4fv(this.envmapCubeProgram.uniforms.projection, false, drawingState.proj);
        gl.uniformMatrix4fv(this.envmapCubeProgram.uniforms.view, false, drawingState.view);
        gl.uniformMatrix4fv(this.envmapCubeProgram.uniforms.model, false, model2);
        var inverseView = twgl.m4.identity();
        twgl.m4.inverse(drawingState.view, inverseView);
        gl.uniformMatrix4fv(this.envmapCubeProgram.uniforms.invView, false, inverseView);

        /*
        * set the vertex attrib pointer information
        * */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.envVertexBuffer);
        gl.vertexAttribPointer(
            this.envmapCubeProgram.attribs.vPos,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.envmapCubeProgram.attribs.vPos);

        /*
        * do the same as above for normals
        *
        * */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.envNormalBuffer);
        gl.vertexAttribPointer(
            this.envmapCubeProgram.attribs.vNormals,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.envmapCubeProgram.attribs.vNormals);

        /*
        *
        * this will help include the uniform the texture in the fragment shader
        *
        * */
        /*gl.bindTexture(gl.TEXTURE_2D, this.texID);
        gl.activeTexture(gl.TEXTURE0);*/

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.envIndicesBuffer);
        gl.drawElements(gl.TRIANGLES, emirateTower.indices.length, gl.UNSIGNED_SHORT, 0);


    };


    Skybox.prototype.center = function (drawingState) {
        return this.position;
    };


    /*
    *
    * convenience quick function for drawing a quick cube taken from www.stackoverflow.com post
    *
    * */
    function cube(side) {
        var s = (side || 1) / 2;
        var coords = [];
        var normals = [];
        var texCoords = [];
        var indices = [];

        function face(xyz, nrm) {
            var start = coords.length / 3;
            var i;
            for (i = 0; i < 12; i++) {
                coords.push(xyz[i]);
            }
            for (i = 0; i < 4; i++) {
                normals.push(nrm[0], nrm[1], nrm[2]);
            }
            texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
            indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
        }

        face([-s, -s, s, s, -s, s, s, s, s, -s, s, s], [0, 0, 1]);
        face([-s, -s, -s, -s, s, -s, s, s, -s, s, -s, -s], [0, 0, -1]);
        face([-s, s, -s, -s, s, s, s, s, s, s, s, -s], [0, 1, 0]);
        face([-s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s], [0, -1, 0]);
        face([s, -s, -s, s, s, -s, s, s, s, s, -s, s], [1, 0, 0]);
        face([-s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s], [-1, 0, 0]);
        return {
            vertexPositions: new Float32Array(coords),
            vertexNormals: new Float32Array(normals),
            vertexTextureCoords: new Float32Array(texCoords),
            indices: new Uint16Array(indices)
        }
    }



})();

grobjects.push(new Skybox("skybox"));