
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
    var buffersSb = undefined;

    var sbposx = document.getElementById('posx');
    var sbnegx = document.getElementById('negx');
    var sbposz = document.getElementById('posz');
    var sbnegz = document.getElementById('negz');
    var sbposy = document.getElementById('posy');
    var sbnegy = document.getElementById('negy');


    Skybox = function Skybox(name) {
        this.name = name;
        this.position = [0, 0, 0];    // will be set in init
    };
   	Skybox.prototype.init = function(drawingState) {
        var gl=drawingState.gl;

        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["skybox-vs1", "skybox-fs1"]);
        }
        if (!buffersSb) {
            var arrays = cube(100);
            buffersSb = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            
			var texture = gl.createTexture();
			/*
			* covers all the 6 faces with the respective part of the humus image
			*
			* */
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sbposx);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sbnegx);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sbposy);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sbposz);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sbnegy);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sbnegz);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        }
    };
    Skybox.prototype.draw = function(drawingState) {

        /*
        * usual drawing stuff made easy by twgl
        * */
        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,twgl.m4.transformPoint(drawingState.camera, [0, 0, 0]),modelM);

        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            proj:drawingState.proj, view: drawingState.view, model: modelM });
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffersSb);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffersSb);
    };
    Skybox.prototype.center = function (drawingState) {
        return this.position;
    };
// could have used own cube mesh but this is handy cube function taken from
    // https://stackoverflow.com/questions/47724706/skybox-webgl-texture-errors?rq=1
    function cube(side) {
	   var s = (side || 1)/2;
	   var coords = [];
	   var normals = [];
	   var texCoords = [];
	   var indices = [];
	   function face(xyz, nrm) {
	      var start = coords.length/3;
	      var i;
	      for (i = 0; i < 12; i++) {
	         coords.push(xyz[i]);
	      }
	      for (i = 0; i < 4; i++) {
	         normals.push(nrm[0],nrm[1],nrm[2]);
	      }
	      texCoords.push(0,0,1,0,1,1,0,1);
	      indices.push(start,start+1,start+2,start,start+2,start+3);
	   }
	   face( [-s,-s,s, s,-s,s, s,s,s, -s,s,s], [0,0,1] );
	   face( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s], [0,0,-1] );
	   face( [-s,s,-s, -s,s,s, s,s,s, s,s,-s], [0,1,0] );
	   face( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s], [0,-1,0] );
	   face( [s,-s,-s, s,s,-s, s,s,s, s,-s,s], [1,0,0] );
	   face( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s], [-1,0,0] );
	   return {
	      vpos: new Float32Array(coords),
	      vnormals: new Float32Array(normals),
	      vtex: new Float32Array(texCoords),
	      indices: new Uint16Array(indices)
	   }
	}

})();

//grobjects.push(new Skybox("skybox2"));

