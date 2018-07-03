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

var Building_notex = undefined;
(function() {
    "use strict";

    Building_notex = function Building_notex(name,buildArray, position, size, rotation, axis, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [0.5, 0.4, 0.6, 1.0];
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
    Building_notex.prototype.init = function (drawingState) {
        var gl = drawingState.gl;

        //var meshes = buildingJson.meshes[0];


        // OK, we have a pair of shaders, we need to put them together
        // into a "shader program" object
        // notice that I am assuming that I can use "this"
        this.shaderProgram1 = createGLProgram(gl, document.getElementById('buildingVsNoTex').text,
            document.getElementById('buildingFsNoTex').text);


        this.shaderProgram1.uniforms = {
            mProj: gl.getUniformLocation(this.shaderProgram1, 'mProj'),
            mView: gl.getUniformLocation(this.shaderProgram1, 'mView'),
            mWorld: gl.getUniformLocation(this.shaderProgram1, 'mWorld'),
            // time:.gl.getUniformLocation.this.shaderProgramm, 'time'),

            pointLightPosition: gl.getUniformLocation(this.shaderProgram1, 'pointLightPosition'),
            meshColor: gl.getUniformLocation(this.shaderProgram1, 'meshColor'),

            //resolution: me.gl.getUniformLocation(me.SceneProgram, 'resolution'),
        };

        // do the same as above for the attributes declares and used in the shader programs

        this.shaderProgram1.attribs = {
            vPos: gl.getAttribLocation(this.shaderProgram1, 'vPos'),
            vNorm: gl.getAttribLocation(this.shaderProgram1, 'vNorm'),
        };


        console.log(emirateTower.vertices);
        for(var i =0; i<emirateTower.vertices.length; i = i+(h)){
            var triangle_input= [];
            for(var j =i; j<i+9; j++){
                triangle_input.push(emirateTower.vertices[j]);
            }

            console.log('triangle_input ', triangle_input);
            var mainInput = [];
            for(var h=0; h< 9; h = h+3){
                console.log('h ', h);
                mainInput.push([triangle_input[h], triangle_input[h+1], triangle_input[h+2]])
            }
            //console.log('normals of emirates');
            console.log(mainInput);
            console.log('h ', h, 'i ', i, 'j ', j);
            var comp_normals = computeNormals(mainInput);
            emirateTower.normals.push(comp_normals[0]);
            emirateTower.normals.push(comp_normals[1]);
            emirateTower.normals.push(comp_normals[2]);
        }
        //console.log(emirateTower.normals);
        console.log(emirateTower.normals);
        var verts = emirateTower.vertices;
        //var sample_normals = computeNormals([verts[0], verts[1], verts[2]]);
        //console.log(sample_normals);
        //console.log(emirateTower);
        this.mesh1 = new Model_noTex(
            gl,
            this.buildArray.vertices,
            this.buildArray.indices,
            this.buildArray.normals,
            vec4.fromValues(this.color[0],this.color[1], this.color[2], this.color[3]),
        );
        mat4.translate(
            this.mesh1.world, this.mesh1.world,
            vec3.fromValues(this.position[0], this.position[1], this.position[2]),
        );
        mat4.rotate(
            this.mesh1.world, this.mesh1.world,
            glMatrix.toRadian(this.rotation),
            vec3.fromValues(this.axis[0], this.axis[1], this.axis[2])
        );
//        console.log(this.size);
        mat4.scale(
            this.mesh1.world, this.mesh1.world,
            vec3.fromValues(this.size, this.size, this.size),
        );


        // mat4.scale()

    };

    /*
    *
    * make a generic draw function which most objects can use we can preserve the versatility of the objects
    * using different flags or we could just let this be here for greater control of the program
    *
    * */
    Building_notex.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;
        // choose the shader program we have compiled
        gl.useProgram(this.shaderProgram1);
        gl.disable(gl.CULL_FACE);
        // enable the attributes we had set up
        gl.uniformMatrix4fv(this.shaderProgram1.uniforms.mProj, false, drawingState.proj);
        gl.uniformMatrix4fv(this.shaderProgram1.uniforms.mView, false, drawingState.view);
        gl.uniform3fv(this.shaderProgram1.uniforms.pointLightPosition, drawingState.sunDirection);
        gl.uniformMatrix4fv(
            this.shaderProgram1.uniforms.mWorld,
            gl.FALSE,
            this.mesh1.world
        );

        gl.uniform4fv(
            this.shaderProgram1.uniforms.meshColor,
            this.mesh1.color
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh1.vbo);
        gl.vertexAttribPointer(
            this.shaderProgram1.attribs.vPos,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.shaderProgram1.attribs.vPos);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh1.nbo);
        gl.vertexAttribPointer(
            this.shaderProgram1.attribs.vNorm,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.shaderProgram1.attribs.vNorm);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh1.ibo);
        // console.log(this.Meshes[i].nPoints);
        gl.drawElements(gl.TRIANGLES, this.mesh1.nPoints, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    };
    Building_notex.prototype.center = function (drawingState) {
        return [0, .5, 0];
    };

    // now that we've defined the object, add it to the global objects list

    /*grobjects.push(new Building_notex(
        "emirateTower",
        emirateTower,
        [-3,1,3.5],
        0.005,
        0,
        [0,0,0],
        [0.8, 0.8, 1.0, 1.0],
    ));*/
    /*grobjects.push(new Building_notex(
        "trumpTower",
        tTower,
        [-3,1,3.5],
        0.005,
        0,
        [0,0,0],
        [0.8, 0.8, 1.0, 1.0],
    ));*/
})();