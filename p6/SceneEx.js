'use strict';

var SceneEx = function (gl) {
    this.gl = gl;

};

var slider4 = document.getElementById('slider4');
slider4.value = 80;
var slider5 = document.getElementById('slider5');
slider5.value = 0;
var slider6 = document.getElementById('slider6');
slider6.value = 0;
var slider7 = document.getElementById('slider7');
slider7.value = 0;
var slider8 = document.getElementById('slider8');
slider8.value = 0;
var slider9 = document.getElementById('slider9');
slider9.value = 0;
var slider10 = document.getElementById('slider10');
slider10.value = 0;
SceneEx.prototype.Load = function (cb) {

    /*
    * TO DO:
    * 1: first fix the rotation of the plane above the table [FIXED ROTATION!]
    * 2: make it hover around the table in a circular direction [FIXED ROTATION!]
    * 3: keep the light position = position of plane
    * 4: add the required uniforms to enable spot lighting emitting from the plane
    * 5: probably explore the same thing above by placing a statue on table
    * 5-2: probably just add the json to to another js file and extract the values into our model class
    * 6: add the required UI elements (see description for this)
    * */


    //first though to be assync
    var me = this;
    //find all the mesh models in the json file and add the require placement positions using
    //translations and rotations and using the model class to create their respective models
    // the model class is responsible for creating all the buffers for vertices, indices and normsls
    // its also takes care of the binding process and databuffer process
    console.log('plane');
    console.log(plane);
    console.log('table');
    console.log(table);

    //extracted the meshes into the respective vars from the json file
    console.log(monitor);
    console.log('chair');
    console.log(chair);

    var planeMeshes = plane.meshes[0];
    var tableMeshes = table.meshes[0];
    var monitorMeshes = monitor.meshes[0];
    var chairMeshes = chair.meshes[0];

    /*var keyboardMeshes = keyboard.meshes[0];
    /!*me.monitorMesh.world, me.monitorMesh.world,
            vec3.fromValues(8.0, 8.0, 8.0)*!/
    me.keyboardMesh = new Model(
        me.gl,
        keyboardMeshes.vertices,
        [].concat.apply([], keyboardMeshes.faces),
        keyboardMeshes.normals,
        vec4.fromValues(0.5, 0.4, 0.6, 1.0),
    );
    mat4.translate(
        me.keyboardMesh.world, me.keyboardMesh.world,
        vec3.fromValues(10.0, 40, 0)
    );
    mat4.scale(
        me.keyboardMesh.world, me.keyboardMesh.world,
        vec3.fromValues(8, 8, 8)
    );*/
    me.cubeMesh = new Model(
        me.gl,
        cubeVertices,
        cubeIndices,
        cubeNormals,
        vec4.fromValues(0.5, 0.4, 0.6, 1.0),
    );
    mat4.translate(
        me.cubeMesh.world, me.cubeMesh.world,
        vec3.fromValues(10.0, 40, 20)
    );
    mat4.scale(
        me.cubeMesh.world, me.cubeMesh.world,
        vec3.fromValues(3, 3, 3)
    );

    me.cubeMesh1 = new Model(
        me.gl,
        cubeVertices,
        cubeIndices,
        cubeNormals,
        vec4.fromValues(0.5, 0.4, 0.6, 1.0),
    );

    mat4.translate(
        me.cubeMesh1.world, me.cubeMesh1.world,
        vec3.fromValues(0, 30, 20)
    );
    mat4.scale(
        me.cubeMesh1.world, me.cubeMesh1.world,
        vec3.fromValues(3, 3, 3)
    );
    me.cubeMesh2 = new Model(
        me.gl,
        cubeVertices,
        cubeIndices,
        cubeNormals,
        vec4.fromValues(0.5, 0.4, 0.6, 1.0),
    );
    mat4.translate(
        me.cubeMesh2.world, me.cubeMesh2.world,
        vec3.fromValues(10, 20, 20)
    );
    mat4.scale(
        me.cubeMesh2.world, me.cubeMesh2.world,
        vec3.fromValues(3, 3, 3)
    );
    me.cubeMeshArray = [
        me.cubeMesh,
        me.cubeMesh1,
        me.cubeMesh2,
    ];

    me.chairMesh = new Model(
        me.gl,
        chairMeshes.vertices,
        [].concat.apply([], chairMeshes.faces),
        chairMeshes.normals,
        vec4.fromValues(0.5, 0.4, 0.6, 1.0),
    );
    mat4.translate(
        me.chairMesh.world, me.chairMesh.world,
        vec3.fromValues(10.0, 40, 0)
    );
    mat4.rotate(
        me.chairMesh.world, me.chairMesh.world,
        glMatrix.toRadian(90),
        vec3.fromValues(1,0,0),
    );
    mat4.rotate(
        me.chairMesh.world, me.chairMesh.world,
        glMatrix.toRadian(4),
        vec3.fromValues(0,0,1),
    );
    mat4.scale(
        me.chairMesh.world, me.chairMesh.world,
        vec3.fromValues(0.025, 0.025, 0.025)
    );
    me.monitorMesh = new Model(
        me.gl,
        monitorMeshes.vertices,
        [].concat.apply([], monitorMeshes.faces),
        monitorMeshes.normals,
        vec4.fromValues(0.5, 0.4, 0.6, 1.0)
    );
    mat4.translate(
        me.monitorMesh.world, me.monitorMesh.world,
        vec3.fromValues(10.0, 4, 3.0)
    );
    mat4.rotate(
        me.monitorMesh.world, me.monitorMesh.world,
        glMatrix.toRadian(-10),
        vec3.fromValues(0, 0, 1)
    );
    mat4.scale(
        me.monitorMesh.world, me.monitorMesh.world,
        vec3.fromValues(8.0, 8.0, 8.0)
    );

    me.lightPosition = vec3.fromValues(10.0, 100, 100);
    me.planeMesh = new Model(
        me.gl,
        planeMeshes.vertices,
        [].concat.apply([], planeMeshes.faces),
        planeMeshes.normals,
        vec4.fromValues(0.8, 0.8, 1.0, 1.0)
    );
    // TRS translate rotate and scale

    mat4.translate(
        me.planeMesh.world, me.planeMesh.world,
        vec3.fromValues(20.0, 5, 30.0)
    );
    mat4.rotate(
        me.planeMesh.world, me.planeMesh.world,
        // QUESTION: see how this angle influences the model
        glMatrix.toRadian(90),
        vec3.fromValues(0, 1, 0)
    );
    mat4.rotate(
        me.planeMesh.world, me.planeMesh.world,
        // QUESTION: see how this angle influences the model
        glMatrix.toRadian(90),
        vec3.fromValues(0, 0, 1)
    );
    mat4.scale(
        me.planeMesh.world,
        me.planeMesh.world,
        vec3.fromValues(0.3, 0.3, 0.3)
    );
    //we can also add code for the required rotation of the plane obj below
    //9963
    me.tableMesh = new Model(
        me.gl,
        tableMeshes.vertices,
        [].concat.apply([], tableMeshes.faces),
        tableMeshes.normals,
        vec4.fromValues(1, 0, 1, 1)
    );
    mat4.translate(
        me.tableMesh.world, me.tableMesh.world,
        vec3.fromValues(-10.0, 0, -20.0)
    );
    mat4.rotate(
        me.tableMesh.world, me.tableMesh.world,
        glMatrix.toRadian(-10),
        vec3.fromValues(0, 0, 1)
    );

    //set the camera values these values have been probably taken blender
    me.camera = new Camera(
        vec3.fromValues(10, 70.0, 25.0),
        vec3.fromValues(-0.3, -1, 1.85),
        vec3.fromValues(0, 0, 1)
    );

    //created the respective model let's see if the models have loaded in a proper manner

    if (!me.planeMesh) {
        console.log('plane mesh has not been loaded');
        return;
    }
    if (!me.tableMesh) {
        console.log('table mesh has not been loaded');
        return;
    }
    //just initializing the meshes this context
    //so that we don't have to traverse through the data json file agains for the meshes
    me.Meshes = [
        //  me.tableMesh,
        me.planeMesh,
        me.monitorMesh,
        me.chairMesh,
        //   me.cubeMesh
        // me.keyboardMesh,
    ];

    // we use the createShaderProgram to create vertex and fragment shader from the specified strings
    //containing the shader source code
    //this class is also responsible for create the shaders and compiling them
    //this is just a convenience function
    // we can make use of this to render different scenes or the same scene with different conditions
    me.SceneProgram_cube = CreateShaderProgram(
        me.gl, document.getElementById('vsCube').text, document.getElementById('fsCube').text
    );

    me.SceneProgram = CreateShaderProgram(
        me.gl, document.getElementById('vs').text, document.getElementById('fs').text
    );
    me.tableProgram = CreateShaderProgram(
        me.gl, document.getElementById('vsTable').text, document.getElementById('fsTable').text
    );

    // now define the uniforms required for us to communicate with the shaders and define them
    //we define them in this context to associate them with this particular scene

    // here we associte the uniforms defined in the shader program with vars
    // in this case we declare proj, view, and world matrices
    me.SceneProgram_cube.uniforms = {
        mProj: me.gl.getUniformLocation(me.SceneProgram_cube, 'mProj'),
        mView: me.gl.getUniformLocation(me.SceneProgram_cube, 'mView'),
        mWorld: me.gl.getUniformLocation(me.SceneProgram_cube, 'mWorld'),
        time: me.gl.getUniformLocation(me.SceneProgram_cube, 'time'),
    };
    me.SceneProgram_cube.attribs = {
        vPos: me.gl.getAttribLocation(me.SceneProgram_cube, 'vertPosition'),
        vColor: me.gl.getAttribLocation(me.SceneProgram_cube, 'vertColor'),
    };
    me.SceneProgram.uniforms = {
        mProj: me.gl.getUniformLocation(me.SceneProgram, 'mProj'),
        mView: me.gl.getUniformLocation(me.SceneProgram, 'mView'),
        mWorld: me.gl.getUniformLocation(me.SceneProgram, 'mWorld'),
        time: me.gl.getUniformLocation(me.SceneProgram, 'time'),

        pointLightPosition: me.gl.getUniformLocation(me.SceneProgram, 'pointLightPosition'),
        meshColor: me.gl.getUniformLocation(me.SceneProgram, 'meshColor'),
        resolution: me.gl.getUniformLocation(me.SceneProgram, 'resolution'),
    };


    // do the same as above for the attributes declares and used in the shader programs
    me.SceneProgram.attribs = {
        vPos: me.gl.getAttribLocation(me.SceneProgram, 'vPos'),
        vNorm: me.gl.getAttribLocation(me.SceneProgram, 'vNorm'),
    };

    me.tableProgram.uniforms = {
        mProj: me.gl.getUniformLocation(me.tableProgram, 'mProj'),
        mView: me.gl.getUniformLocation(me.tableProgram, 'mView'),
        mWorld: me.gl.getUniformLocation(me.tableProgram, 'mWorld'),
        time: me.gl.getUniformLocation(me.tableProgram, 'time'),

        pointLightPosition: me.gl.getUniformLocation(me.tableProgram, 'pointLightPosition'),
        meshColor: me.gl.getUniformLocation(me.tableProgram, 'meshColor'),
        resolution: me.gl.getUniformLocation(me.tableProgram, 'resolution'),
    };
    me.tableProgram.attribs = {
        vPos: me.gl.getAttribLocation(me.tableProgram, 'vPos'),
        vNorm: me.gl.getAttribLocation(me.tableProgram, 'vNorm'),
    };



    // in the same way create projective matrix and view matrices
    me.projMatrix = mat4.create();
    me.viewMatrix = mat4.create();

    //making use of gl-matrix methods for creating
    // we could have used the same for the camera but we made our camera so that we could code
    // in the camera functions on our own
    mat4.perspective(
        me.projMatrix,
        glMatrix.toRadian(90),
        me.gl.canvas.clientWidth / me.gl.canvas.clientHeight,
        0.2,
        85
    );
    console.log('done with this');

    console.log(me.gl.canvas.width);

};


SceneEx.prototype.Begin = function () {
    console.log('Beginning demo scene');
    //first thought to be async
    var me = this;

    // Loop
    var previousFrame = performance.now();
    var dt = 0;
    var hor =2.5;
    var time = 1.0;
    var loop = function (currentFrameTime) {
        dt = currentFrameTime - previousFrame;
        ++hor;
        time += 0.5;
        me._Update(dt,hor);
       /* console.log('begin');
        console.log(time);*/
        previousFrame = currentFrameTime;

        //console.log('begin');

        me._Render(time);
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);



};
//8118
SceneEx.prototype._Update = function (dt,hor) {
    /*mat4.rotateZ(
        this.planeMesh.world, this.planeMesh.world,
        dt / 1000 * 2 * Math.PI *    0.3
    );
    mat4.rotateX(
        this.planeMesh.world, this.planeMesh.world,
        dt / 1000 * 2 * Math.PI *    0.3
    );*/

    mat4.perspective(
        this.projMatrix,
        glMatrix.toRadian(slider4.value),
        this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
        0.2,
        85
    );
    var forward = slider5.value *0.1;
    // console.log(slider5.value);
    this.camera.moveForward(forward);
    this.camera.moveRight(slider6.value*0.1);
    this.camera.moveUp(slider7.value * 0.1);
    var rotateRight = glMatrix.toRadian(slider8.value*0.001);
    this.camera.rotateRight(rotateRight);
    var horLocal = 2.0*0.01;
    mat4.translate(
        this.planeMesh.world,
        this.planeMesh.world,
        vec3.fromValues(horLocal, 0, 0)
    );
    mat4.rotateY(
        this.planeMesh.world, this.planeMesh.world,
        dt / 100 * 2 * Math.PI * 0.3*0.1
    );

    mat4.rotateZ(
        this.monitorMesh.world, this.monitorMesh.world,
        dt / 100 * 2 * Math.PI * 0.3 * 0.1
    );
    // mat4.rotateY(
    //     this.tableMesh.world, this.tableMesh.world,
    //     dt / 100 * 2 * Math.PI * 0.3 * 0.1
    // );

    this.camera.GetViewMatrix(this.viewMatrix);

};

SceneEx.prototype._Render = function (time) {
    // /console.log(data);
    var gl = this.gl;
    // console.log(data);


    gl.enable(gl.DEPTH_TEST);

    //gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    ++time;
    gl.clearColor(0, 0, 0, 1);
    //clearing depth buffer as mentioned in the description
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.SceneProgram);
    // console.log('crosses use program');
    gl.uniformMatrix4fv(this.SceneProgram.uniforms.mProj, gl.FALSE, this.projMatrix);
    gl.uniformMatrix4fv(this.SceneProgram.uniforms.mView, gl.FALSE, this.viewMatrix);
    gl.uniform3fv(this.SceneProgram.uniforms.pointLightPosition, this.lightPosition);
    gl.uniform2fv(this.SceneProgram.uniforms.resolution, [600,600]);
    /*console.log('time');
    console.log(time);*/
    gl.uniform1f(this.SceneProgram.uniforms.time, time);
    for (var i = 0; i < this.Meshes.length; i++) {
        // Per object uniforms
        gl.uniformMatrix4fv(
            this.SceneProgram.uniforms.mWorld,
            gl.FALSE,
            this.Meshes[i].world
        );

        gl.uniform4fv(
            this.SceneProgram.uniforms.meshColor,
            this.Meshes[i].color
        );

        // Set attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].vbo);
        gl.vertexAttribPointer(
            this.SceneProgram.attribs.vPos,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.SceneProgram.attribs.vPos);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].nbo);
        gl.vertexAttribPointer(
            this.SceneProgram.attribs.vNorm,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.SceneProgram.attribs.vNorm);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Meshes[i].ibo);
        // console.log(this.Meshes[i].nPoints);
        gl.drawElements(gl.TRIANGLES, this.Meshes[i].nPoints, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }
    /*
    *
    * CUBE CUSTOM PROGRAM
    *
    * */
    gl.useProgram(this.SceneProgram_cube);
    gl.uniformMatrix4fv(this.SceneProgram_cube.uniforms.mProj, gl.FALSE, this.projMatrix);
    gl.uniformMatrix4fv(this.SceneProgram_cube.uniforms.mView, gl.FALSE, this.viewMatrix);
    gl.uniform1f(this.SceneProgram_cube.uniforms.time, time);
    for(var j=0; j< this.cubeMeshArray.length; j++){
        gl.uniformMatrix4fv(
            this.SceneProgram_cube.uniforms.mWorld,
            gl.FALSE,
            this.cubeMeshArray[j].world
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeMeshArray[j].vbo);
        gl.vertexAttribPointer(
            this.SceneProgram_cube.attribs.vPos,
            3, gl.FLOAT, gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT,0
        );
        gl.enableVertexAttribArray(this.SceneProgram_cube.attribs.vPos);

        gl.vertexAttribPointer(
            this.SceneProgram_cube.attribs.vColor,
            3, gl.FLOAT, gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT,
        );
        gl.enableVertexAttribArray(this.SceneProgram_cube.attribs.vColor);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeMeshArray[j].ibo);
        gl.drawElements(gl.TRIANGLES, this.cubeMeshArray[j].nPoints, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }




    /*
    *
    * TABLE WITH A DIFFERENT FRAGMENT SHADER AND WITH ITS OWN PROGRAM
    *
    * */
    gl.useProgram(this.tableProgram);
    // console.log('crosses use program');
    gl.uniformMatrix4fv(this.tableProgram.uniforms.mProj, gl.FALSE, this.projMatrix);
    gl.uniformMatrix4fv(this.tableProgram.uniforms.mView, gl.FALSE, this.viewMatrix);
    gl.uniform3fv(this.tableProgram.uniforms.pointLightPosition, this.lightPosition);
    gl.uniform2fv(this.tableProgram.uniforms.resolution, [600,600]);
    /*console.log('time');
    console.log(time);*/
    gl.uniform1f(this.tableProgram.uniforms.time, time);

    // Per object uniforms
    gl.uniformMatrix4fv(
        this.tableProgram.uniforms.mWorld,
        gl.FALSE,
        this.tableMesh.world
    );

    gl.uniform4fv(
        this.tableProgram.uniforms.meshColor,
        this.tableMesh.color
    );

    // Set attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tableMesh.vbo);
    gl.vertexAttribPointer(
        this.tableProgram.attribs.vPos,
        3, gl.FLOAT, gl.FALSE,
        0, 0
    );
    gl.enableVertexAttribArray(this.SceneProgram.attribs.vPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.tableMesh.nbo);
    gl.vertexAttribPointer(
        this.tableProgram.attribs.vNorm,
        3, gl.FLOAT, gl.FALSE,
        0, 0
    );
    gl.enableVertexAttribArray(this.tableProgram.attribs.vNorm);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.tableMesh.ibo);
    // console.log(this.Meshes[i].nPoints);
    gl.drawElements(gl.TRIANGLES, this.tableMesh.nPoints, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


};

