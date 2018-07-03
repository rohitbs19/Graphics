function setup() { "use strict";
    var canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var context = canvas.getContext('2d');
    var m4 = twgl.m4;

    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
    var slider3 = document.getElementById('slider3');
    slider3.value = 0;
    var slider4 = document.getElementById('slider4');
    slider4.value = 0;
    var slider5 = document.getElementById('slider5');
    slider5.value = 0;

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
        // A little cross on the front face, for identification
        context.fillStyle = 'green';
        moveToTx(0,0,0,Tx);lineToTx(50,0,0,Tx);context.stroke();
        moveToTx(0,0,0,Tx);lineToTx(0,150,0,Tx);context.stroke();
        moveToTx(0,0,0,Tx);lineToTx(0,0,250,Tx);context.stroke();
    }
    var x =400; // 200
    var y=500; //300
    var z=600;//100
    function drawPyramid(Tx) {

        // context.translate(x_mov, y_mov);
       // context.save();
        context.lineWidth = 2;
        context.fillStyle = 'red';
        context.beginPath();
        moveToTx(x,y,z,Tx);
        lineToTx(x-100,y-200,z-100,Tx);
        lineToTx(x-100, y-200, z+100, Tx);
        lineToTx(x, y, z, Tx);
        //context.fill();
        moveToTx(x-100, y-200, z+100, Tx);
        lineToTx(x+100, y-200, z+100, Tx);
        lineToTx(x, y, z, Tx);
        //context.fill();
        moveToTx(x+100, y-200, z+100, Tx);
        lineToTx(x+100, y-200, z-100, Tx);

        lineToTx(x, y, z, Tx);
      //  context.fill();
        moveToTx(x-100, y-200, z-100, Tx);
        lineToTx(x+100, y-200, z-100, Tx);
        context.stroke();
        //context.fill();
      //  context.restore();
       // context.stroke();
    }
     function drawCube(Tx) {
    // A little cross on the front face, for identification

    // Twelve edges of a cube
         context.lineWidth = 42;
         context.fillStyle = 'orange';
    moveToTx(100,100,100,Tx);
    lineToTx(300,100,100,Tx);
    lineToTx(300,300,100,Tx);
    lineToTx(100,300,100,Tx);
   // context.fill();
    moveToTx(300,100,100,Tx);
    lineToTx(300,100,300,Tx);
    lineToTx(300,300,300,Tx);
    lineToTx(300,300,100,Tx);
    //context.fill();
    moveToTx(300,100,300,Tx);
    lineToTx(100,100,300,Tx);
    lineToTx(100,300,300,Tx);
    lineToTx(300,300,300,Tx);
    //context.fill();
    moveToTx(100,100,300,Tx);
    lineToTx(100,100,100,Tx);
    lineToTx(100,300,100,Tx);
    lineToTx(100,300,300,Tx);
    //context.fill();
         context.stroke();
  }

    function draw() {
        // hack to clear the canvas fast
        canvas.width = canvas.width;
        context.save();
        context.translate(400, 200);
        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = rotation*0.01*Math.PI;
        var axis = [1,1,1];
        var axis_2 = [0, 1, 0];
        var axis_3 = [1, 0,0];
        var Tmodel=m4.axisRotation(axis,angle2);
        var Tmodel_2 = m4.axisRotation(axis_2, angle2);
        var Tmodel_3 = m4.axisRotation(axis_3, angle2);
        var eye=[500*Math.cos(angle1),300,500*Math.sin(angle1)];
        var target=[0,0,0];
        var up=[0,1,0];
        var Tcamera=m4.inverse(m4.lookAt(eye,target,up));
        var Tmodelview=m4.multiply(Tmodel,Tcamera);
        var Tmodelview_2 = m4.multiply(Tmodel_2, Tcamera);
        var Tmodelview_3 = m4.multiply(Tmodel_3, Tcamera);
      //  context.translate(100, 100);
         context.save();
         context.strokeStyle = "orange";
         context.translate(x_mov, y_mov);
        // context.rotate(rotation*0.1);
       // context.translate(-x_mov, -y_mov);
         drawPyramid(Tmodelview);
         drawCube(Tmodelview_2);

     //   context.translate(100, 100);
       // drawPyramid(Tmodelview_3);

      //  drawAxes(Tcamera);
    }
    slider1.addEventListener("input",draw);
    slider3.addEventListener("input", draw);
    slider4.addEventListener("input", draw);
    slider5.addEventListener("input", draw);
    slider2.addEventListener("input",draw);
    var up =false;
    var down = false;
    var left = false;
    var right = false;
    var x_mov = 0;
    var y_mov = 0;
    var rotation =0;
    function update() {
        if(right) {
            x_mov += 6;
        }
        if(up) {
            y_mov -= 6;
        }
        if(left) {
            x_mov -= 6;
        }
        if(down){
            y_mov += 6;
        }
        ++rotation;
    }
window.addEventListener("keydown", checkKey, false);
function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        up = true;


    }
    else if (e.keyCode == '40') {
        // down arrow
        down = true;

    }
    else if (e.keyCode == '37') {
        // left arrow
        left = true;


    }
    else if (e.keyCode == '39') {
        // right arrow
        right = true;

    }

    e.preventDefault();

}


    function animate() {
        context.clearRect(200, 100, canvas.width, canvas.height);
        update();
        draw();
        up = false;
        down = false;
        left = false;
        right = false;
        requestAnimationFrame(animate);
    }
    animate();
}
window.onload = setup;
