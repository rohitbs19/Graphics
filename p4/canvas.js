



/*
* Structure of the program*/
/*
* first initial geometry*/

// includes triangles or polygons with coordinated to be pushed in user defined stack

/*
* then a function to draw the desired obj with triangles placed at those spots
* using js canvas functions of stroke etc*/


/*draw world function which draws the figures based on a sorted list of triangle arrays
* painters algorithm and depth perception */

/*design the model enabling power to various sliders and implement different
 * transformations based on requirements and cater to the demands of the graphics
  * pipeline
  * */
function setup() { "use strict";
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var m4 = twgl.m4;

    //Camera Toggle
    var redBox = document.getElementById('redBox');
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
    var slider3 = document.getElementById('slider3');
    slider3.value = 0;
    var slider8 = document.getElementById('slider8');
    slider8.value = 80;
    var slider9 = document.getElementById('slider9');
    slider9.value = 0;
    var slider10 = document.getElementById('slider10');
    slider10.value = 0;
    var slider11 = document.getElementById('slider11');
    slider11.value = 0;
    var slider12 = document.getElementById('slider12');
    slider12.value = 0;
    var slider13 = document.getElementById('slider13');
    slider13.value = 0;
    var slider14 = document.getElementById('slider14');
    slider14.value = 0;

    function moveToTx(x,y,z,Tx) {
        var loc = [x,y,z];
        var locTx = m4.transformPoint(Tx,loc);
        context.moveTo(locTx[0]+250,-locTx[1]+250);
    }

    function lineToTx(x,y,z,Tx) {
        var loc = [x,y,z];
        var locTx = m4.transformPoint(Tx,loc);
        context.lineTo(locTx[0]+250,-locTx[1]+250);
    }

    function drawAxes(Tx) {
        context.strokeStyle = "Black";
        // A little cross on the front face, for identification
        moveToTx(0,0,0,Tx);lineToTx(50,0,0,Tx);context.stroke();
        moveToTx(0,0,0,Tx);lineToTx(0,150,0,Tx);context.stroke();
        moveToTx(0,0,0,Tx);lineToTx(0,0,250,Tx);context.stroke();
    }

    //Stores all trangles that will be drawn
    var triangles_primitive = [];
    var camera_x = 0;
    var wheel_x = 0;
    //Method intializes all triangles_primitive
    function initGeometry(){
        //Castle
        // upper front base left
        triangles_primitive.push([[0,200,100],[100,200,100],[0,200,50],"#4e42f4",0.0]);
        //console.log(triangles_primitive[0][3]);
        //down above
        triangles_primitive.push([[0,200,50],[100,200,50],[100,200,100],"#4e42f4",0.0]);
        //console.log(triangles_primitive[1][4]);
        //Back down
        triangles_primitive.push([[0,0,50],[100,0,50],[0,200,50],"#4e42f4",0.0]);
        //back top
        triangles_primitive.push([[0,200,50],[100,200,50],[100,0,50],"#4e42f4",0.0]);

        //front
        triangles_primitive.push([[0,0,100],[100,0,100],[0,200,100],"#4e42f4",0.0]);
        //upper
        triangles_primitive.push([[0,200,100],[100,200,100],[100,0,100],"#4e42f4",0.0]);


        //left bot minority
        triangles_primitive.push([[0,200,50],[0,0,50],[0,0,100],"#4e42f4",0.0]);
        //left top minority
        triangles_primitive.push([[0,200,50],[0,200,100],[0,0,50 + 50],"#4e42f4",0.0]);

        triangles_primitive.push([[0,200,50],[0,0,50],[0,0,100],"#4e42f4",0.0]);
        //left top minority
        triangles_primitive.push([[0,200,50],[0,200,100],[0,0,50 + 50],"#4e42f4",0.0]);

        //right minority down
        triangles_primitive.push([[100,0,50],[100,0,100],[100,200,50],"#4e42f4",0.0]);

        var x_offset = 350;
        var z_offset=100;
        var y_offset = 100;

        //right minority up
        triangles_primitive.push([[100+x_offset,200+y_offset,100+z_offset],[100+x_offset,0+y_offset,100+z_offset],[100+x_offset,200+y_offset,50+z_offset],"#4e42f4",0.0,5]);

        triangles_primitive.push([[0+x_offset,200+y_offset,100+z_offset],[100+x_offset,200+y_offset,100+z_offset],[0+x_offset,200+y_offset,50+z_offset],"#4e42f4",0.0,5]);
        //console.log(triangles_primitive[0][3]);
        //down above
        triangles_primitive.push([[0+x_offset,200+y_offset,50+z_offset],[100+x_offset,200+y_offset,50+z_offset],[100+x_offset,200+y_offset,100+z_offset],"#4e42f4",0.0,5]);
        //console.log(triangles_primitive[1][4]);
        //Back down
        triangles_primitive.push([[0+x_offset,0+y_offset,50+z_offset],[100+x_offset,0+y_offset,50+z_offset],[0+x_offset,200+y_offset,50+z_offset],"#4e42f4",0.0,5]);
        //back top
        triangles_primitive.push([[0+x_offset,200+y_offset,50+z_offset],[100+x_offset,200+y_offset,50+z_offset],[100+x_offset,0+y_offset,50+z_offset],"#4e42f4",0.0,5]);

        //front
        triangles_primitive.push([[0+x_offset,0+y_offset,100+z_offset],[100+x_offset,0+y_offset,100+z_offset],[0+x_offset,200+y_offset,100+z_offset],"#4e42f4",0.0,5]);
        //upper
        triangles_primitive.push([[0+x_offset,200+y_offset,100+z_offset],[100+x_offset,200+y_offset,100+z_offset],[100+x_offset,0+y_offset,100+z_offset],"#4e42f4",0.0,5]);


        //left bot minority
        triangles_primitive.push([[0+x_offset,200+y_offset,50+z_offset],[0+x_offset,0+y_offset,50+z_offset],[0+x_offset,0+y_offset,100+z_offset],"#4e42f4",0.0,5]);
        //left top minority
        triangles_primitive.push([[0+x_offset,200+y_offset,50+z_offset],[0+x_offset,200+y_offset,100+z_offset],[0+x_offset,0+y_offset,50 + 50+z_offset],"#4e42f4",0.0,5]);

        triangles_primitive.push([[0+x_offset,200+y_offset,50+z_offset],[0+x_offset,0+y_offset,50+z_offset],[0+x_offset,0+y_offset,100+z_offset],"#4e42f4",0.0,5]);
        //left top minority
        triangles_primitive.push([[0+x_offset,200+y_offset,50+z_offset],[0+x_offset,200+y_offset,100+z_offset],[0+x_offset,0+y_offset,50 + 50+z_offset],"#4e42f4",0.0,5]);

        //right minority down
        triangles_primitive.push([[100+x_offset,0+y_offset,50+z_offset],[100+x_offset,0+y_offset,100+z_offset],[100+x_offset,200+y_offset,50+z_offset],"#4e42f4",0.0,5]);


        //right minority up
        triangles_primitive.push([[100+x_offset,200+y_offset,100+z_offset],[100+x_offset,0+y_offset,100+z_offset],[100+x_offset,200+y_offset,50+z_offset],"#4e42f4",0.0,5]);

        //emirates towers
        var z= 250;
        //front
        triangles_primitive.push([[0,0,z],[100,0,z-50],[0,200,z],"orange",0.0]);
        triangles_primitive.push([[0,200,z],[100,200,z-50],[100,0,z-50],"orange",0.0]);

        //back
        triangles_primitive.push([[0,0,z-100],[100,0,z-50],[0,200,z-100],"orange",0.0]);

        //front
        triangles_primitive.push([[0,200,z-100],[100,0,z-50],[100,200,z-50],"orange",0.0]);

        //majority centre down
        triangles_primitive.push([[0,0,z-100],[0,200,z],[0,0,z],"orange",0.0]);
        //majority centre up
        triangles_primitive.push([[0,0,z-100],[0,200,z-100],[0,200,z],"orange",0.0]);

        //roof front
        triangles_primitive.push([[0,200,z],[100,200,z-50],[100,270,z-50],"orange",0.0]);
        //back roof
        triangles_primitive.push([[0,200,z-100],[100,200,z-50],[100,270,z-50],"orange",0.0]);

        //entire roof cover
        triangles_primitive.push([[0,200,z-100],[0,200,z],[100,270,z-50],"orange",0.0]);


        // //car
        // triangles_primitive.push([[200,20,150],[200,50,200],[200,20,250],"gold",0.0]);
        //
        // //wheels
        //  triangles_primitive.push([[200,0,170],[200,20,170+10],[200,0,190],"gold",0.0]);
        z = 350;
        triangles_primitive.push([[0,0,z],[100,0,z-50],[0,200,z],"orange",0.0]);
        triangles_primitive.push([[0,200,z],[100,200,z-50],[100,0,z-50],"orange",0.0]);

        //back
        triangles_primitive.push([[0,0,z-100],[100,0,z-50],[0,200,z-100],"orange",0.0]);

        //front
        triangles_primitive.push([[0,200,z-100],[100,0,z-50],[100,200,z-50],"orange",0.0]);

        //majority centre down
        triangles_primitive.push([[0,0,z-100],[0,200,z],[0,0,z],"orange",0.0]);
        //majority centre up
        triangles_primitive.push([[0,0,z-100],[0,200,z-100],[0,200,z],"orange",0.0]);

        //roof front
        triangles_primitive.push([[0,200,z],[100,200,z-50],[100,270,z-50],"orange",0.0]);
        //back roof
        triangles_primitive.push([[0,200,z-100],[100,200,z-50],[100,270,z-50],"orange",0.0]);

        //entire roof cover
        triangles_primitive.push([[0,200,z-100],[0,200,z],[100,270,z-50],"orange",0.0]);

        //cube

        var x_cube = 300;
        var y_cube = 200;
        var z_cube = 250;
        //left
//         triangles_primitive.push([[x_cube, y_cube-100, z_cube-200], [x_cube, y_cube,z_cube-200], [x_cube, y_cube-100, z_cube],"blue", 0.0,5]);
//         triangles_primitive.push([[x_cube, y_cube-100, z_cube], [x_cube, y_cube,z_cube], [x_cube, y_cube,z_cube-200],"blue", 0.0]);
//         //right
//         triangles_primitive.push([[x_cube+100, y_cube-100, z_cube], [x_cube+100, y_cube,z_cube], [x_cube+100, y_cube,z_cube-200],"blue", 0.0]);
//         triangles_primitive.push([[x_cube+100, y_cube-100, z_cube-200], [x_cube+100, y_cube,z_cube-200], [x_cube+100, y_cube-100, z_cube],"blue", 0.0]);
//         //back
//         triangles_primitive.push([[x_cube, y_cube-100, z_cube-200], [x_cube+100, y_cube,z_cube-200], [x_cube+100, y_cube-100,z_cube-200],"blue", 0.0]);
//         triangles_primitive.push([[x_cube, y_cube-100, z_cube-200], [x_cube, y_cube,z_cube-200], [x_cube+100, y_cube,z_cube-200],"blue", 0.0]);
// //front
//         triangles_primitive.push([[x_cube, y_cube-100, z_cube], [x_cube+100, y_cube,z_cube], [x_cube+100, y_cube-100,z_cube],"blue", 0.0]);
//         triangles_primitive.push([[x_cube, y_cube-100, z_cube], [x_cube, y_cube,z_cube], [x_cube+100, y_cube,z_cube],"blue", 0.0])
// //top
//         triangles_primitive.push([[x_cube, y_cube, z_cube - 200], [x_cube + 100, y_cube, z_cube - 200], [x_cube + 100, y_cube, z_cube], "blue", 0.0]);
//         triangles_primitive.push([[x_cube, y_cube, z_cube - 200], [x_cube + 100, y_cube, z_cube], [x_cube, y_cube, z_cube], "blue", 0.0]);
//         triangles_primitive.push([[x_cube, y_cube - 100, z_cube], [x_cube + 100, y_cube - 100, z_cube], [x_cube + 100, y_cube - 100, z_cube - 200], "blue", 0.0]);
//         triangles_primitive.push([[x_cube, y_cube - 100, z_cube], [x_cube + 100, y_cube, z_cube], [x_cube, y_cube - 100, z_cube - 200], "blue", 0.0]);
//         //
//         triangles_primitive.push([[x_cube, y_cube - 100, z_cube], [x_cube + 100, y_cube, z_cube], [x_cube, y_cube - 100, z_cube - 200], "blue", 0.0]);
//         //back left
        drawWheel();
        //Floor Pattern
        for(var i = 0; i < 20; i++){
            var z = i * 20;
            for(var k = 0; k < 20; k++){
                var x = k*20;
                var col1 = parseInt(Math.random() * 255);
                var col2 = parseInt(Math.random() * 255);
                var col3 = parseInt(Math.random() * 255);


                triangles_primitive.push([[x,-20,z],[x+20,-20,z],[x,-20,z+20],"#A9A9A9",0.0]);//Left
                triangles_primitive.push([[x,-20,z+20],[x+20,-20,z+20],[x+20,-20,z],"#F0FFFF",0.0]);//Right
            }
        }

    }
   var TmodelRot_building;
    var TmodelRot_wheel;
    var Tmodel1;
    function drawWheel() {
        var x_offset = 350;
        var z_offset=100;
        var y_offset = 100;
        triangles_primitive.push([[300, 50, 100], [300, 100, 125], [300, 50,150 ], "red", 0.0,10]);
        triangles_primitive.push([[300, 50, 100+100], [300, 100, 125+100], [300, 50,150+100 ], "red", 0.0,10]);
        triangles_primitive.push([[400, 50, 100], [300+100, 100, 125], [300+100, 50,150 ], "red", 0.0,10]);
        triangles_primitive.push([[300+100, 50, 100+100], [300+100, 100, 125+100], [300+100, 50,150+100 ], "red", 0.0,10]);

    }
    //Draws a Triangle to Screen
    //Triangle Struct: First Point - Second Point - Third Point - Color - Order
    function drawTriangle(triangle, Tx){
        context.beginPath();
        context.strokeStyle="white";
        // context.lineWidth = 0.025;
        if(redBox.checked){ //Adds color based off distance
            // console.log(-triangle[4] * 0.4);
            context.fillStyle = "rgb("+Math.floor(-triangle[4]*0.5)+",215,0)"
        }
        else{

                context.fillStyle=triangle[3];


        }
        if(triangle[5] == "lux"){
            var scaleLux = slider3.value * .005;
            Tx = m4.multiply(m4.scaling([1,1+scaleLux,1]),Tx);

        }
        var model ;
        var axis_wheel = [1, 0, 0];
        var axis_building = [0, 1, 0];
        var angle_wheel = camera_x*0.01 * Math.PI/4;

         TmodelRot_building = m4.axisRotation(axis_building, angle_wheel);

         TmodelRot_wheel = m4.multiply(m4.axisRotation(axis_wheel, angle_wheel), TmodelRot_building);    // var rot1 = camera_x*0.05*Math.PI/4;

         Tmodel1 = m4.multiply(m4.rotationY(angle_wheel), TmodelRot_wheel);
        if(triangle[5]===10) {
            console.log("reaching here!1");
            model = m4.multiply(TmodelRot_wheel, Tx);
        }else if(triangle[5]===5){
            model = m4.multiply(Tmodel1,Tx);
        }else{
            model = Tx;
        }

        moveToTx(triangle[0][0], triangle[0][1], triangle[0][2], model);
        lineToTx(triangle[1][0], triangle[1][1], triangle[1][2], model);
        lineToTx(triangle[2][0], triangle[2][1], triangle[2][2], model);

        context.closePath();
        context.stroke();
        context.fill();
    }

    //Loops through all triangles_primitive and draws them
    function drawWorld(Tx,wheel){
        bubbleSort(triangles_primitive);
        for(var i=0;i<triangles_primitive.length;i++) {

                drawTriangle(triangles_primitive[i], Tx);


        }
    }

    function bubbleSort(arr)
    {
        var swapped;
        do {
            swapped = false;
            for (var i=0; i < arr.length-1; i++) {
                if (arr[i][4] > arr[i+1][4]) {
                    var temp = arr[i];
                    arr[i] = arr[i+1];
                    arr[i+1] = temp;
                    swapped = true;
                }
            }
        } while (swapped);
    }

    function draw() {

        canvas.width = canvas.width;

        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = slider2.value*0.01*Math.PI;
        var axis = [1,1,1];
        // var angle2_wheel = slider3.value * 0.01 * Math.PI / 4;
        // var axisWheel = [0, 0, -1];
        // var TWheel_rot = m4.axisRotation(axisWheel, angle2_wheel);

        var Tmodelrot=m4.axisRotation(axis,angle2);
        var rot = slider1.value*0.005*Math.PI;
        var Tmodel = m4.multiply(m4.rotationY(rot),Tmodelrot);



        /*passing a different model with different rotations for the wheels part*/


        var eye=[0 ,300+ parseInt(slider10.value), 600]; //LOOK From

        //console.log("inside draw function = ", camera_x);

        var target=[100+ parseInt(slider12.value),0 + parseInt(slider13.value),100 + parseInt(slider14.value)]; //LOOK At
        var up=[0,1,0]; //Direction

        var fov = parseInt(slider8.value)/180*Math.PI;
        var Tprojection = m4.perspective((-Math.PI / 4) + fov + 20, 1, 4, 3000);
        // sets it in accordance to screen by scaling it on the basis of width and height
        var Tviewport=m4.multiply(m4.scaling([200,200,200]),m4.translation([0,0,0])); //WHY NOT -200 for middle val
        //Do we scale because it was 1,1,1 cube
        var Tcamera=m4.inverse(m4.lookAt(eye,target,up));
        //viewing transformation set
        //Torihection sets in the cube and sets it to normalized co ordinates in accordance to canonical co ordinates
        var Tcpv=m4.multiply(m4.multiply(Tcamera,Tprojection),Tviewport);
        //Tmodel applies rotations to the camera
        var Tmc=m4.multiply(Tmodel,Tcamera);
        var Tmodelview=m4.multiply(Tmodel,Tcpv);
        /*HAVE INTRODUCE ORTHOGONAL PROJECTION
        * like an option to change from perspective projection*/

        for(var i=0;i<triangles_primitive.length;i++){

            var centroid = [];
            var centroid_x = (triangles_primitive[i][0][0] + triangles_primitive[i][1][0] + triangles_primitive[i][2][0])/3;
            var centroid_y = (triangles_primitive[i][0][1] + triangles_primitive[i][1][1] + triangles_primitive[i][2][1])/3;
            var centroid_z = (triangles_primitive[i][0][2] + triangles_primitive[i][1][2] + triangles_primitive[i][2][2])/3;
            centroid.push([centroid_x, centroid_y, centroid_z]);

            // triangles_primitive.push([[30,60,0+200],[80,60,0+200],[80,50,0+200],"gray",0.0]);
            //console.log("1st pt: ",centroid[0],"2nd pt: ",  centroid[1],"3rd ", centroid[2]);
             var cam;


                cam = m4.transformPoint(Tmc, centroid[0]);
           //console.log(cam);
            triangles_primitive[i][4] = cam[2];

        }

        drawWorld(Tmodelview);


    }

    redBox.addEventListener("click", draw);
    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    slider8.addEventListener("input",draw);
    slider9.addEventListener("input",draw);
    slider10.addEventListener("input",draw);
    slider11.addEventListener("input",draw);
    slider13.addEventListener("input",draw);
    slider14.addEventListener("input",draw);

    function update() {
        //console.log("inside update function = ", slider3.value);
        camera_x = camera_x + slider3.value*0.1;
        wheel_x = wheel_x + slider12.value * 0.1;
        console.log("update: wheel_x= ", wheel_x);
       // console.log(camera_x);
    }

    initGeometry();

    function animate() {
        context.clearRect(200, 200, canvas.width, canvas.height);
        // initGeometry();
        update();
        console.log(camera_x);

        draw();
        // console.log("hello");
        requestAnimationFrame(animate);


    }

    animate();

}
window.onload = setup;
