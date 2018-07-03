var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var speedSlider1 = document.getElementById('speedSlider1');
var speedSlider2 = document.getElementById('speedSlider2');
var speedSlider3 = document.getElementById('speedSlider3');


// The current rotation for the wheels, the sliders just control
// the rate at which these values change.
var rotation1 = 0;
var rotation2 = 0;
var rotation3 =0;
var up =false;
var down = false;
var left = false;
var right = false;



var x_for = 0;
var y_for = 0;
function wheel(rot,size) {
    c.beginPath();
    this.rot = rot;
    for(var i =0; i<2*Math.PI; i = i + 0.01) {
        var x = size * Math.cos(6 * i) * Math.cos(i);
        var y = size * Math.cos(6 * i) * Math.sin(i);

        c.lineTo(x, y);
    }
    if(this.rot===1) {
        c.fill();
    }else{
        c.stroke();
    }
}

function update() {
    var rotationSpeed1 = 0;//parseFloat(speedSlider1.value);
    var rotationSpeed2 = 0;//parseFloat(speedSlider2.value);
    var rotationSpeed3 = 0;//parseFloat(speedSlider3.value);
    if(up) {
        rotation3 -= 0.01;
        // if(rotation3>=0.2) {
        //     rotation3 = 0.2;
        // }
    }
    if(down) {
        rotation3 +=0.01;
        // if(rotation3<=-0.2) {
        //     rotation3 = -0.2;
        // }
    }
    if(left) {
        rotation2 -= 0.01;
        // if(rotation1>=0.2) {
        //     rotation1 = 0.2;
        // }
    }
    if(right) {
        rotation1 += 0.01;
        // if(rotation2<=-0.2) {
        //     rotation2 = -0.2;
        // }
    }
    // rotation1 += rotationSpeed1;
    // rotation2 += rotationSpeed2;
    // rotation3 += rotationSpeed3;
    //console.log(rotation3 * 0.01);
    // if(rotationSpeed3<0.1 && rotationSpeed3>-0.1) {
    //     rotation3 =0;
    // }
   // console.log(x_for, "and canvas_width ", canvas.width);

    var count_x=0;
    var count_x2 = 0;
    var count_y = 0;
    var count_y2 = 0;
    console.log(x_for, " x_for canvas.width", canvas.width);
    if(x_for>=-55 && x_for<=canvas.width - 375  )
        x_for += (rotation2 + rotation1) * 16;
    else{


        if(x_for<-55) {
            if(count_x===0) {
                x_for =-56;
                rotation2 =0;
            }
            ++count_x;
            if(right) {
                x_for += (rotation2 + rotation1) * 16;

            }
        }
        else if(x_for>canvas.width - 375) {
            if(count_x2===0) {
                x_for = canvas.width - 374;
                rotation1=0;
            }
            ++count_x2;
            if(left) {
                x_for += (rotation1 + rotation2) * 16;
            }
        }
    }

    if(y_for>=-170 && y_for <=canvas.height -231 )
        y_for += rotation3*16;
    else{
        if(y_for<-170) {
            if(count_y===0) {
                y_for =-170;
                rotation3 =0;
            }
            ++count_y;
            if(down) {
                y_for += (rotation3) * 16;
            }
        }
        else if(y_for>canvas.height - 231) {
            if(count_y2===0) {
                y_for = canvas.height - 231;
                rotation3=0;
            }
            ++count_y2;
            if(up) {
                y_for += (rotation3) * 16;
            }
        }

    }

}
var body = function (x,y) {
    this.x = x;
    this.y = y;
    c.save();
    c.beginPath();
    c.translate(this.x, this.y);
    c.lineTo(50, 30);
    c.lineTo(100, 30);
    c.lineTo(150, 0);
    c.lineTo(200, 30);
    c.lineTo(250, 30);
    c.lineTo(300, 0);
    c.lineTo(250, -30);
    c.lineTo(200, -30);
    c.lineTo(150, 0);
    c.lineTo(100, -30);
    c.lineTo(50, -30);
    c.lineTo(0, 0);
    c.lineTo(50, 30);
    c.fill();
    c.restore();
};
var sun = new Image();
var moon = new Image();
var earth = new Image();
sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';

function draw() {
    c.clearRect(-150, -200, canvas.width, canvas.height);
    // c.translate((x_for - 100) / 2, Math.floor(-125/2));
    c.globalCompositeOperation = 'destination-over';
    // c.clearRect(0,0,300,300);
    c.fillStyle = 'rgba(0,0,0,0.4)';
    c.strokeStyle = 'rgba(0,153,255,0.4)';
    c.save();
    c.translate(270+10+10,300+10);

    // Earth
    var time = new Date();
    c.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
    c.translate(225,0);
    // c.fillRect(0,-12,50,24); // Shadow
    c.drawImage(earth,50,50);

    // Moon
    c.save();
    c.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
    c.translate(100,15.5);
    c.drawImage(moon,-3.5,-3.5);
    c.restore();

    c.restore();

    // c.beginPath();
    // c.arc(250+20,300-50,300,300,0,Math.PI*2,false); // Earth orbit
    // c.stroke();

    c.drawImage(sun,-200,-250,canvas.width,canvas.height);

    c.restore();


    c.save();
    c.strokeStyle = "orange";
    c.translate(x_for, y_for);
    c.rotate(rotation1*10);


    wheel(2,15);

    c.restore();
    c.save();
    c.strokeStyle = 'orange';
    c.translate(x_for+150, y_for);
    c.rotate(rotation2*10);

    wheel(2,15);

    c.restore();
    c.save();
    c.fillStyle = 'rgba(0,153,255,0.4)';
    // c.rect(x_for-50, y_for-100, 200,100);
    // c.stroke();
    body(x_for-75, y_for);
    c.restore();
    c.save();
    c.translate(x_for + 75, y_for);
    c.rotate(rotation3*10);
    c.fillStyle = 'rgba(0,153,255,0.4)';
    wheel(1, 25);
    c.restore();



}

//c.save();
c.translate(150, 200);

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
    c.save();




    update();
    up =false;
    down = false;
    left = false;
    right = false;
    //c.translate((x_for - 100) / 2, Math.floor(-125/2));
    //c.rotate(rotation3*0.01);
    // c.translate(-2*(x_for - 100) / 2, -2*Math.floor(-125/2));
    draw();

    c.restore();

    window.requestAnimationFrame(animate);
}

animate();


