
var canvas = document.querySelector('canvas');
// canvas.width = window.innerWidth;
// canvas.height = window.height;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
c.fillStyle = "black";
c.fillRect(0,0,canvas.width, canvas.height);
var maxRadius = 300;
var minRadius = 5;
var colorArray = [
	'#F5BC0C',
	'#F59018',
	'#F26105',
	'#BD2404',
	'#750401',
];
var mouse = {
	x: undefined,
	y: undefined
};
window.addEventListener('mousemove', function(event){
	mouse.x = event.x;
	mouse.y = event.y;
	console.log(event);

});

function Circle(x, y, dx, dy,radius){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.color = colorArray[Math.floor(Math.random()*colorArray.length)];
	this.draw = function(){
		c.beginPath();
		c.arc(mouse.x,mouse.y, this.radius, 0, Math.PI *2, false);
		c.strokeStyle = this.color;
		c.stroke();
		// c.fillStyle = this.color;
		// c.fill();
	}
	this.update = function(){
	if(this.x + this.radius>window.innerWidth || (this.x - this.radius) < 0){
		this.dx = -this.dx;
	}
	if(this.y+this.radius>window.innerHeight || this.y-this.radius < 0 ){
		this.dy = -this.dy;
	}

	this.y = this.y + this.dy;
	this.x = this.x + this.dx;
	if(mouse.x - this.x < 200 && mouse.x - this.x >-200 && mouse.y - this.y < 200 
		&& mouse.y - this.y >-200){
		if(this.radius < maxRadius){
			this.radius = this.radius + 6;
		}
	}else if(this.radius>minRadius){
			this.radius = this.radius -1;
	}
	this.draw();
	}
}
var circleArray = [];
for(var i =0; i<2000; i++){
	radius = 100;
	var x = Math.random()*(window.innerWidth - radius*2) + radius;
	var y = Math.random()*(window.innerHeight -radius*2) + radius;
	var dx =(Math.random()-0.5)*4;
	var dy =(Math.random()-0.5)*4;
	
	circleArray[i] = new Circle(x,y,dx,dy,radius);
}
var circle = new Circle(x,y,dx,dy, radius);
function animate(){
	
	requestAnimationFrame(animate);
	c.clearRect(0,0,window.innerWidth, window.innerHeight);	
	
	for(var i=0; i<circleArray.length; i++){
		circleArray[i].update();
	}
	//circle.update();

}
animate();


