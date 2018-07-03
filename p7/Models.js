'use strict';

var Model = function (gl, vertices, indices, normals, texCoords, isTexture, color) {
    this.vbo = gl.createBuffer();
    this.ibo = gl.createBuffer();
    this.nbo = gl.createBuffer();
    this.tex = gl.createBuffer();
    this.nPoints = indices.length;
    this.isTexture = isTexture;
    this.world = mat4.create();
    this.color = color;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    if(this.isTexture) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};
var Model_noTex = function (gl, vertices, indices, normals, color) {
    this.vbo = gl.createBuffer();
    this.ibo = gl.createBuffer();
    this.nbo = gl.createBuffer();

    this.nPoints = indices.length;

    this.world = mat4.create();
    this.color = color;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};
var createGLShader = function (gl, type, src) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("warning: shader failed to compile!")
        console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

var createGLProgram = function (gl, vSrc, fSrc) {
    var program = gl.createProgram();
    var vShader = createGLShader(gl, gl.VERTEX_SHADER, vSrc);
    var fShader = createGLShader(gl, gl.FRAGMENT_SHADER, fSrc);
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("warning: program failed to link");
        return null;

    }
    return program;
};
var createGLBuffer = function (gl, data, usage) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
};

var findAttribLocations = function (gl, program, attributes) {
    var out = {};
    for (var i = 0; i < attributes.length; i++) {
        var attrib = attributes[i];
        out[attrib] = gl.getAttribLocation(program, attrib);
    }
    return out;
};

var findUniformLocations = function (gl, program, uniforms) {
    var out = {};
    for (var i = 0; i < uniforms.length; i++) {
        var uniform = uniforms[i];
        out[uniform] = gl.getUniformLocation(program, uniform);
    }
    return out;
};

var enableLocations = function (gl, attributes) {
    for (var key in attributes) {
        var location = attributes[key];
        gl.enableVertexAttribArray(location);
    }
};

//always a good idea to clean up your attrib location bindings when done. You wont regret it later.
var disableLocations = function (gl, attributes) {
    for (var key in attributes) {
        var location = attributes[key];
        gl.disableVertexAttribArray(location);
    }
};

//creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
//it's mostly going to be a try it once, flip if you need to.
var createGLTexture = function (gl, image, flipY) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (flipY) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
};

var TexturedPlane = function () {
    this.name = "TexturedPlane"
    this.position = new Float32Array([0, 0, 0]);
    this.scale = new Float32Array([1, 1]);
    this.program = null;
    this.attributes = null;
    this.uniforms = null;
    this.buffers = [null, null]
    this.texture = null;
};
var CreateShaderProgram = function (gl, vsText, fsText) {
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsText);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        return {
            error: 'Error compiling vertex shader: ' + gl.getShaderInfoLog(vs)
        };
    }

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsText);
    gl.compileShader(fs);


    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.validateProgram(program);
    return program;

    // Check: if (result.error)
    // otherwise, program is GL program.
};

var Camera = function (position, lookAt, up) {
    this.forward = vec3.create();
    this.up = vec3.create();
    this.right = vec3.create();

    this.position = position;

    vec3.subtract(this.forward, lookAt, this.position);
    vec3.cross(this.right, this.forward, up);
    vec3.cross(this.up, this.right, this.forward);

    vec3.normalize(this.forward, this.forward);
    vec3.normalize(this.right, this.right);
    vec3.normalize(this.up, this.up);
};

Camera.prototype.GetViewMatrix = function (out) {
    var lookAt = vec3.create();
    vec3.add(lookAt, this.position, this.forward);
    mat4.lookAt(out, this.position, lookAt, this.up);
    return out;
};

Camera.prototype.rotateRight = function (rad) {
    var rightMatrix = mat4.create();
    mat4.rotate(rightMatrix, rightMatrix, rad, vec3.fromValues(0, 0, 1));
    vec3.transformMat4(this.forward, this.forward, rightMatrix);
    this._realign();
};

Camera.prototype._realign = function() {
    vec3.cross(this.right, this.forward, this.up);
    vec3.cross(this.up, this.right, this.forward);

    vec3.normalize(this.forward, this.forward);
    vec3.normalize(this.right, this.right);
    vec3.normalize(this.up, this.up);
};

Camera.prototype.moveForward = function (dist) {
    vec3.scaleAndAdd(this.position, this.position, this.forward, dist);
};

Camera.prototype.moveRight = function (dist) {
    vec3.scaleAndAdd(this.position, this.position, this.right, dist);
};

Camera.prototype.moveUp = function (dist) {
    vec3.scaleAndAdd(this.position, this.position, this.up, dist);
};