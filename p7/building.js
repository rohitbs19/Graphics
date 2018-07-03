/**
 * Created by gleicher on 10/9/2015.
 */

/**
 the simplest possible object for the system

 look at this example first.
 be sure to read grobject.js to understand what this object is an "instance of"
 (even though there is no class definition)

 this object does the absolute minimum set of things.
 also, it defines everything itself - there is not prototype that we
 make lots of copies of.

 it will draw a pyramid at the origin. it's pretty useless - since it's in this fixed
 location
 but it's a start

 i am doing this without twgl - even though it makes my code kindof big.
 but it should be easier to see the GL calls
 the GL stuff is very much based on the "two transformed colored triangles" example from
 class (see the JSBin)
 **/

// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// now, I make a function that adds an object to that list
// there's a funky thing here where I have to not only define the function, but also
// run it - so it has to be put in parenthesis

var Building = undefined;
(function() {
    "use strict";

    Building = function Building(name,buildArray, position, size, rotation, axis, color,TextureSrc,isPresent) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [0.5, 0.4, 0.6, 1.0];
        this.TextureSrc = TextureSrc;
        this.isPresent = isPresent;
        this.buildArray = buildArray;
        this.rotation = rotation;
        this.axis = axis;
    };
    // first I will give this the required object stuff for it's interface
    // note that the init and draw functions can refer to the fields I define
    // below

    // the two workhorse functions - init and draw
    // init will be called when there is a GL context
    // this code gets really bulky since I am doing it all in place
    Building.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        var  buildingJson = this.buildArray;
        var meshes = buildingJson.meshes[0];


            // OK, we have a pair of shaders, we need to put them together
        // into a "shader program" object
        // notice that I am assuming that I can use "this"
        this.shaderProgram = createGLProgram(gl, document.getElementById('buildingVs').text,
            document.getElementById('buildingFs').text);
			// this.shaderProgram = twgl.createProgramInfo(gl, ["buildingVs", "buildingFs"]);


        this.shaderProgram.uniforms = {
            mProj: gl.getUniformLocation(this.shaderProgram, 'mProj'),
            mView: gl.getUniformLocation(this.shaderProgram, 'mView'),
            mWorld: gl.getUniformLocation(this.shaderProgram, 'mWorld'),
			//flashLight: gl.getUniformLocation(this.shaderProgram, 'spotlightPos'),
            // time:.gl.getUniformLocation.this.shaderProgramm, 'time'),

            pointLightPosition: gl.getUniformLocation(this.shaderProgram, 'pointLightPosition'),
            meshColor: gl.getUniformLocation(this.shaderProgram, 'meshColor'),
            //  uTex: gl.getUniformLocation(this.shaderProgram, 'uTexture'),
            //resolution: me.gl.getUniformLocation(me.SceneProgram, 'resolution'),
        };

        // do the same as above for the attributes declares and used in the shader programs
        if (this.isPresent) {
            this.shaderProgram.attribs = {
                vPos: gl.getAttribLocation(this.shaderProgram, 'vPos'),
                vNorm: gl.getAttribLocation(this.shaderProgram, 'vNorm'),
                texCoordAttribLocation: gl.getAttribLocation(this.shaderProgram, 'vertTexCoord'),
                // Tex: gl.getAttribLocation(this.shaderProgram, 'aTexCoord'),
            };
        }else{
            this.shaderProgram.attribs = {
                vPos: gl.getAttribLocation(this.shaderProgram, 'vPos'),
                vNorm: gl.getAttribLocation(this.shaderProgram, 'vNorm'),
            }
        }

        var textCoords;
        if (this.isPresent) {
            textCoords = meshes.texturecoords[0];
        }else{
            textCoords =0;
        }
        this.mesh = new Model(
            gl,
            meshes.vertices,
            [].concat.apply([], meshes.faces),
            meshes.normals,
            textCoords,
            this.isPresent,
            vec4.fromValues(this.color[0],this.color[1], this.color[2], this.color[3]),
        );
        mat4.translate(
            this.mesh.world, this.mesh.world,
            vec3.fromValues(this.position[0], this.position[1], this.position[2]),
        );
        mat4.rotate(
            this.mesh.world, this.mesh.world,
            glMatrix.toRadian(this.rotation),
            vec3.fromValues(this.axis[0], this.axis[1], this.axis[2])
        );
        mat4.scale(
            this.mesh.world, this.mesh.world,
            vec3.fromValues(this.size, this.size, this.size),
        );
        /*var image = new Image();
        image.src = "https://farm1.staticflickr.com/816/39590121450_11ed2e35a9_m.jpg";*/

            this.midTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.midTexture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                gl.UNSIGNED_BYTE,
                document.getElementById(this.TextureSrc)
            );
            gl.bindTexture(gl.TEXTURE_2D, null);



        // mat4.scale()

    };

    /*
    *
    * make a generic draw function which most objects can use we can preserve the versatility of the objects
    * using different flags or we could just let this be here for greater control of the program
    *
    * */
    Building.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;
        // choose the shader program we have compiled
        gl.useProgram(this.shaderProgram);
        gl.disable(gl.CULL_FACE);
        // enable the attributes we had set up
        gl.uniformMatrix4fv(this.shaderProgram.uniforms.mProj, false, drawingState.proj);
        gl.uniformMatrix4fv(this.shaderProgram.uniforms.mView, false, drawingState.view);
        gl.uniform3fv(this.shaderProgram.uniforms.pointLightPosition, drawingState.sunDirection);
		//gl.uniform3fv(this.shaderProgram.uniforms.flashLight, drawingState.heliFlash);

        // gl.uniform1i(this.uniforms.uTex, 1);

        gl.uniformMatrix4fv(
            this.shaderProgram.uniforms.mWorld,
            gl.FALSE,
            this.mesh.world
        );

        gl.uniform4fv(
            this.shaderProgram.uniforms.meshColor,
            this.mesh.color
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vbo);
        gl.vertexAttribPointer(
            this.shaderProgram.attribs.vPos,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.shaderProgram.attribs.vPos);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.nbo);
        gl.vertexAttribPointer(
            this.shaderProgram.attribs.vNorm,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.shaderProgram.attribs.vNorm);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        if(this.isPresent) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.tex);

            gl.vertexAttribPointer(
                this.shaderProgram.attribs.texCoordAttribLocation, // Attribute location
                2, // Number of elements per attribute
                gl.FLOAT, // Type of elements
                gl.FALSE,
                2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                0
            );
            gl.enableVertexAttribArray(this.shaderProgram.attribs.texCoordAttribLocation);


            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, this.midTexture);
            gl.activeTexture(gl.TEXTURE0);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.ibo);
        // console.log(this.Meshes[i].nPoints);
        gl.drawElements(gl.TRIANGLES, this.mesh.nPoints, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    };
    Building.prototype.center = function (drawingState) {
        return [0, .5, 0];
    };

    //now that we've defined the object, add it to the global objects list
    grobjects.push(new Building(
        "mid",
        building1_cylinder,
        [3, 1.4, 2],
        1.5,
        0,
        [0,0,0],
        [0.5, 0.4, 0.6, 1.0],
        "MidTexture",
        true,

    ));
    grobjects.push(new Building(
        "mid",
        building1_cylinder,
        [3, 1.4, -2],
        1.5,
        0,
        [0,0,0],
        [0.8, 0.8, 1.0, 1.0],
        "MidTexture",
        true,

    ));
    grobjects.push(new Building(
        "piller",
        piller,
        [-1, 1, 4.5],
        1,
        0,
        [0,0,0],
        [0.8, 0.8, 1.0, 1.0],
        "PillerTexture",
        true,
    ));
    grobjects.push(new Building(
        "piller2",
        piller,
        [1.5, 1, 4.5],
        1,
        0,
        [0,0,0],
        [0.8, 0.8, 1.0, 1.0],
        "PillerTexture",
        true,
    ));
    grobjects.push(new Building(
        "guard",
        guard,
        [-0.8+0.1, 0.7, 3.5],
        0.75,
        90,
        [0,1,0],
        [0.8, 0.8, 1.0, 1.0],
        "GuardTexture",
        true,
    ));
    grobjects.push(new Building(
        "guard2",
        guard,
        [1.3-0.1, 0.7, 3.5],
        0.75,
        -90,
        [0,1,0],
        [0.8, 0.8, 1.0, 1.0],
        "GuardTexture",
        true,
    ));
    grobjects.push(new Building(
        "modernHouse",
        modHouse,
        [-3, 0.3, -2],
        0.3,
        0,
        [0, 0, 0],
        [0.8, 0.8, 1.0, 1.0],
        "ModernHouseTexture",
        true,
    ));

})();