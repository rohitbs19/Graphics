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
(function() {
    "use strict";

    // I am keeping the shader code here so it doesn't "leak" out - it's ugly, but it will
    // keep this example simple. i do not recommend this for future objects
    var vertexSource = ""+
        "precision highp float;" +

        "attribute vec3 vnormal;" +
        "attribute vec3 pos;" +
        "attribute vec3 inColor;" +
        "varying vec3 outColor;" +
        "uniform mat4 view;" +
        "uniform mat4 proj;" +
        "uniform mat4 model;"+
        "varying vec3 fPos;" +
        "varying vec3 fNorm;" +
        "void main(void) {" +
        "fPos = (model * vec4(pos, 1.0)).xyz;" +
        "        fNorm = (model * vec4(vnormal, 0.0)).xyz;"+
        "  gl_Position = proj * view *model * vec4(pos, 1.0);" +
        //" vec4 normal = normalize(model * vec4(vnormal,0.0));"+
        //"float diffuse = .5 + .5*abs(dot(normal, vec4(pointLight,0.0)));"+
        "  outColor = inColor ;" +
        "}";
    var fragmentSource = "" +
        "precision highp float;" +

        "uniform vec3 pointLight;"+
        "varying vec3 outColor;" +
        "varying vec3 fPos;" +
        "varying vec3 fNorm;" +
        "const float Ka         = 0.6;"+
        "const float Kd         = 0.2;"+
        "const float Ks         = 0.2;"+
        "const float sExp       = 32.0;"+
    "const vec3  lightCol   = vec3(1.0,1.0,1.0);"+
        "uniform vec3 spotlightPos;"+
        "vec3 spotlight(vec3 fpos) {" +
        "        float dotProd = dot(normalize(fpos - spotlightPos), normalize(-spotlightPos));" +
        "        if (dotProd >= 0.95 && length(fpos - spotlightPos) < 60.0) {" +
        "            float distance = length(fpos - spotlightPos);" +
        "            float intensity = .1 + .3*pow((60.0 - distance)/60.0, 4.0) + pow(((dotProd - 0.95)/0.05), 4.0)*.2;\n" +
        "            return vec3(intensity, intensity, intensity);" +
        "        }" +
        "        return vec3(0,0,0);" +
        "    }"+

        "void main(void) {" +
        "vec3 s=normalize(pointLight);" +
        "vec3 n=normalize(fNorm);" +
        "vec3 v=normalize(-fPos);" +
        "vec3 h=normalize(v+s);"+

        "vec3 ambientColor  = Ka*outColor.xyz;" +
        "vec3 diffuseColor  = Kd*outColor.xyz*dot(s,n);" +
        "vec3 specularColor = Ks*lightCol*pow(max(dot(h,n),0.0),sExp);" +
        "gl_FragColor = vec4( diffuseColor +specularColor + ambientColor + spotlight(fPos) , 1.0);"+
       // "  gl_FragColor = vec4(outColor, 1.0);" +
        "}";
    // putting the arrays of object info here as well
    var chg = 1;
    var vertexPos = [
        -chg, 0.0, -chg,    // triangle 1
        chg, 0.0, -chg,
        0.0, 2.0,  0.0,

        chg, 0.0, -chg,    // triangle 2
        chg, 0.0,  chg,
        0.0, 2.0,  0.0,

        chg, 0.0,  chg,    // triangle 3
        -chg, 0.0,  chg,
        0.0, 2.0,  0.0,

        -chg, 0.0,  chg,    // triangle 4
        -chg, 0.0, -chg,
        0.0, 2.0,  0.0,
    ];
    // make each triangle be a slightly different color - but each triangle is a solid color
    var vertexColors = [
        1.0, 1.0, 0.0,   0.7, 0.0, 1.0,   0.1, 1.0, 0.6,    // tri 1 = yellow
        0.7, 0.0, 1.0,  1.0, 1.0, 0.0,   0.1, 1.0, 0.6,    // tri 2 = cyan
        1.0, 1.0, 0.0,   0.7, 0.0, 1.0,   0.1, 1.0, 0.6,   // tri 3 = magenta
        0.7, 0.0, 1.0,  1.0, 1.0, 0.0,   0.1, 1.0, 0.6,  // tri 4 = green
    ];

    var vertexTexCoords = [

    ];
    var vertexNormals = [

        0,-0.4472135954999579,0.8944271909999159,
        0,-0.4472135954999579,0.8944271909999159,
        0,-0.4472135954999579,0.8944271909999159,

        -0.8944271909999159,-0.4472135954999579,0,
        -0.8944271909999159,-0.4472135954999579,0,
        -0.8944271909999159,-0.4472135954999579,0,

        0,-0.4472135954999579,-0.8944271909999159,
        0,-0.4472135954999579,-0.8944271909999159,
        0,-0.4472135954999579,-0.8944271909999159,

        0.8944271909999159,-0.4472135954999579,0,
        0.8944271909999159,-0.4472135954999579,0,
        0.8944271909999159,-0.4472135954999579,0,
        0.8944271909999159,-0.4472135954999579,0,

    ];

    // define the pyramid object
    // note that we cannot do any of the initialization that requires a GL context here
    // we define the essential methods of the object - and then wait
    //
    // another stylistic choice: I have chosen to make many of my "private" variables
    // fields of this object, rather than local variables in this scope (so they
    // are easily available by closure).
    var size_new =[2.05,1.4,1.5];
    var trans_new =[ -3,2.88,   1];
    var pyramid = function pyramid(name,size, trans,angle,axis) {
        this.name = name;
        this.size = size;
        this.trans = trans;
        this.angle = angle;
        this.axis = axis;
        this.orientation = 1;
    };
        // first I will give this the required object stuff for it's interface
        // note that the init and draw functions can refer to the fields I define
        // below


        // the two workhorse functions - init and draw
        // init will be called when there is a GL context
        // this code gets really bulky since I am doing it all in place
    pyramid.prototype.init = function (drawingState) {
        // an abbreviation...
        var gl = drawingState.gl;

        // compile the vertex shader
        /*
        * createshaderProgram
        *
        * */
        /*this.normals = [];
        for(var i =0; i<vertexPos.length; i = i+(h)){
            var triangle_input= [];
            for(var j =i; j<i+9; j++){
                triangle_input.push(vertexPos[j]);
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
            this.normals.push(comp_normals[0]);
            this.normals.push(comp_normals[1]);
            this.normals.push(comp_normals[2]);
           /!* emirateTower.normals.push(comp_normals[0]);
            emirateTower.normals.push(comp_normals[1]);
            emirateTower.normals.push(comp_normals[2]);*!/
        }*/
        /*console.log('simplest');
        console.log(this.normals);*/
        //we could use createShaderMethod to make return the appropriate new program.
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(vertexShader));
            return null;
        }
        // now compile the fragment shader
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(fragmentShader));
            return null;
        }
        // OK, we have a pair of shaders, we need to put them together
        // into a "shader program" object
        // notice that I am assuming that I can use "this"
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, vertexShader);
        gl.attachShader(this.shaderProgram, fragmentShader);
        gl.linkProgram(this.shaderProgram);
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialize shaders");
        }
        /*
        * create shader program should take care of all this stuff
        *
        */
        // get the locations for each of the shader's variables
        // attributes and uniforms
        // notice we don't do much with them yet
        /*
        *
        * use a local variable through this and point to a distinction between uniforms and
        * attributes this.pyramid.uniforms ...
        * */
        this.posLoc = gl.getAttribLocation(this.shaderProgram, "pos");
        this.colorLoc = gl.getAttribLocation(this.shaderProgram, "inColor");
        this.normalLoc = gl.getAttribLocation(this.shaderProgram, "vnormal");
        this.projLoc = gl.getUniformLocation(this.shaderProgram, "proj");
        this.viewLoc = gl.getUniformLocation(this.shaderProgram, "view");
        this.modelLoc = gl.getUniformLocation(this.shaderProgram, "model");
        this.sunlight = gl.getUniformLocation(this.shaderProgram, "pointLight");
        this.flashLight = gl.getUniformLocation(this.shaderProgram, "spotlightPos");
        // now to make the buffers for the 4 triangles
        /*
        *
        * these properties have to be taken care by a model method which takes and number of flags,
        * depending on the availability of information for various models and does the create buffer,
        * bindbuffer and buffer data on its own
        *
        * */
        this.posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    };

        /*
        *
        * make a generic draw function which most objects can use we can preserve the versatility of the objects
        * using different flags or we could just let this be here for greater control of the program
        *
        * */
    pyramid.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;
        advance(gl, drawingState, this);
        // choose the shader program we have compiled
        var modelT = twgl.m4.create();
        twgl.m4.translate(modelT, this.trans, modelT);
        switch (this.axis) {
            case "X":
                twgl.m4.rotateX(modelT, glMatrix.toRadian(this.angle), modelT);
                break;
            case "Y":
                twgl.m4.rotateY(modelT, glMatrix.toRadian(this.angle), modelT);
                break;

            case "Z":
                twgl.m4.rotateZ(modelT, glMatrix.toRadian(this.angle), modelT);
                break;
        }
        twgl.m4.rotateY(modelT, glMatrix.toRadian(this.orientation) , modelT);
        twgl.m4.scale(modelT, this.size, modelT);
        gl.useProgram(this.shaderProgram);
        // enable the attributes we had set up
        gl.enableVertexAttribArray(this.posLoc);
        gl.enableVertexAttribArray(this.colorLoc);


        // set the uniforms
        gl.uniformMatrix4fv(this.viewLoc, false, drawingState.view);
        gl.uniformMatrix4fv(this.projLoc, false, drawingState.proj);
        gl.uniformMatrix4fv(this.modelLoc, false, modelT);
        gl.uniform3fv(this.sunlight, drawingState.sunDirection);
        gl.uniform3fv(this.flashLight, drawingState.heliFlash);
        // connect the attributes to the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.normalLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(this.colorLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);

        gl.enable(gl.DEPTH_TEST);
        gl.drawArrays(gl.TRIANGLES, 0, 12);
    };
    pyramid.prototype.center = function (drawingState) {
        return [0, .5, 0];
    };

    function advance(gl, drawingState, pyramid) {
        pyramid.orientation +=1;

    }

        // these are the internal methods / fields of this specific object
        // we want to keep the shaders and buffers - rather than rebuild them
        // every draw. we can't initialize them now, but rather we need to wait
        // until there is a GL context (when we call init)
        // technically, these don't need to be defined here - init can just
        // add fields to the object - but I am putting them here  since it feels
        // more like a normal "class" declaration
    //this.shaderProgram = undefined;
    //     this.posBuffer = undefined;
    //     this.colorBuffer = undefined;
    //     this.posLoc = -1;
    //     this.colorLoc= -1;
    //     this.projLoc =-1;
    //     this.viewLoc =-1;


    // now that we've defined the object, add it to the global objects list
    grobjects.push(new pyramid('pyramid1',[1.025,0.7,0.75],[ -3,2.88,   1] ));
    grobjects.push(new pyramid('pyramid2', [0.5, 0.5, 0.5], [0, 0, 0]));
    grobjects.push(new pyramid('pyramid2', [0.5, 1.0, 0.5], [0, 1, 0]));
    grobjects.push(new pyramid('pyramid2', [0.5, 0.5, 0.5], [0, 1, 0], 180,"X"));
    //grobjects.push(pyramid);
})();