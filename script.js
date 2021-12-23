/*
When the lights glow, it lags everything, perhaps they should now glow like that.
*/

var WIDTH;
var HEIGHT;
var mainTree;
var frontgroundSnow = new Array(100);
var backgroundSnow = new Array(100);
var midgroundSnow = new Array(100);
var backgroundTrees = new Array(8);
var testLight = new Array(30);
var lightColorOn  = [];
var lightColorOff = [];
var lightColorShine = [];
var shine;
//var treeLights = new Array(20);

function setup() {
	WIDTH = windowWidth;
	HEIGHT = windowHeight;
	var canvas = createCanvas(WIDTH, HEIGHT);
	canvas.parent('displayCanvas');
	noStroke();

	//testLight = new Light(WIDTH/2, HEIGHT/2, 10);
  //testLight = new Light(WIDTH/2, HEIGHT/2, 10, mainTree);

	mainTree = new Tree(WIDTH / 2, HEIGHT * 0.15, 4, 0.8, 7);

  lightColorOn = [color(220,40,35,255),color(220,220,220,255),color(255,195,60,255)];
  lightColorOff = [color(187,4,0,255),  color(185,185,185,255),color(230,175,20,255)];
  lightColorShine = [color(220,40,35,10),color(220,220,220,10),color(255,195,60,10)];
  for (let i = 0; i < testLight.length; i++)
    testLight[i] = new Light(WIDTH/2, HEIGHT/2, HEIGHT/40, mainTree);
	for (let i = 0; i < frontgroundSnow.length; i++) {
		frontgroundSnow[i] = new Snowflake(random(0, WIDTH), random(0, HEIGHT), random(3, 8), color(240));
		backgroundSnow[i] = new Snowflake(random(0, WIDTH), random(0, HEIGHT), random(3, 8), color(80, 80, 100));
		midgroundSnow[i] = new Snowflake(random(0, WIDTH), random(0, HEIGHT), random(3, 8), color(160, 160, 160));
	}
	for (let i = 0; i < backgroundTrees.length; i++) {
    let temp =  random(1.5,2.5);
    let layer = round(random(2, 5));
		backgroundTrees[i] = new Tree(WIDTH * (i+0.5) * 0.125, HEIGHT*0.8 - HEIGHT * 0.2 / temp * layer + random(-HEIGHT*0.02,HEIGHT*0.02), layer, 1/temp, random(5,9));
	}
	/*for(let i = 0; i < treeLights.length; i++){
		treeLights[i] = new Light(tempCoord[0], tempCoord[1], HEIGHT/100);
	}*/
}

function draw() {
	background(20, 20, 60);
	for (let i = 0; i < backgroundSnow.length; i++) {
		backgroundSnow[i].display();
		backgroundSnow[i].move();
	}

	for (let i = 0; i < midgroundSnow.length; i++) {
		midgroundSnow[i].display();
		midgroundSnow[i].move();
	}

	for (let i = 0; i < backgroundTrees.length; i++) {
		backgroundTrees[i].drawTree();
	}
	mainTree.drawTree();
  star(mainTree.x,mainTree.y,0.3*mainTree.scaleX,0.7*mainTree.scaleX,5,testLight[0]);
  if (testLight[0].on)
    for (let i = 0; i < 10; i++){
      shine = true;
      star(mainTree.x,mainTree.y,0.3*mainTree.scaleX+i,0.7*mainTree.scaleX+i,5,testLight[0]);
    }
  shine = false;
  for (let i = 0; i < testLight.length; i++)
	  testLight[i].display();
	for (let i = 0; i < frontgroundSnow.length; i++) {
		frontgroundSnow[i].display();
		frontgroundSnow[i].move();
	}
	drawGround();

	/*for(let i = 0; i < treeLights.length; i++){
		treeLights[i].display();
	}*/

}

class Tree {
	constructor(x, y, layer, scale, colorScale) {
		this.x = x;
		this.y = y;
		this.layer = layer;
		this.scale = scale;
		this.scaleX = HEIGHT * 0.1 * scale;
		this.scaleY = HEIGHT * 0.2 * scale;
		this.trunk = HEIGHT * 0.07 / 3 * layer * scale;
		this.treeColor = getTreeColor(colorScale);
    this.trunkColor = getTrunkColor();
	}
	drawTree() {
		fill(this.treeColor);
		for (let i = 0; i < this.layer; i++) {
			triangle(this.x, this.y + this.scaleX * 0.5 * i, this.x - this.scaleX * (i + 1), this.y + this.scaleY * (i + 1), this.x + this.scaleX * (i + 1), this.y + this.scaleY * (i + 1));
		}
		//fill(150, 75, 0);
    fill(this.trunkColor);
		rect(this.x - this.trunk, this.y + this.scaleY * this.layer, this.trunk * 2, HEIGHT);
	}
}

getTreeColor = (x) => color(x * floor(random(5, 7)), x * floor(random(10, 14)), x * floor(random(2, 6)));

//getTreeColor = () => color(floor(random(50, 70)), floor(random(100, 140)), floor(random(10, 60)));

getTrunkColor = () => color(floor(random(130, 170)), floor(random(55, 95)), floor(random(0, 20)));


randomTreePos = (tree) => {
  let y = random(tree.scaleY * 0.25, tree.scaleY * tree.layer);
  if (y < tree.scaleY * tree.layer / 4)
    y = random(tree.scaleY * 0.25, tree.scaleY * tree.layer);
  let x = random(tree.scaleX * y / tree.scaleY * -1, tree.scaleX * y / tree.scaleY);

	return [tree.x + x, tree.y + y];
}

class Snowflake {
	//hi this is connell hagen. if you are reading this you have discovered some code that i probably wrote. if you want to use this it is free to use as open source free resources i believe are vital to the learning coding experience. maybe once in a while just drop by and give me a couple hundred dollars as a thank you once you have a job (thanks to you stealing my code). have a wonderful day.
	constructor(x, y, size, color) {
		this.x = x;
		this.y = y;
		//this.size = size * WIDTH / 600; 
    //i changed this so the lights, tree, and snow all scale in the same dircetion -- if you mess with the code and find out it scales weird change it back please
    this.size = size * HEIGHT / 400
		this.speed = random(.4, 1.2);
		this.offset = random(0, 180 * Math.PI);
		this.color = color;
	}

	move() {
		this.y += this.speed;
		if (this.y > HEIGHT) this.y = 0;
		this.x += (this.speed * .5 * cos((frameCount + this.offset) / 180));
		if (this.x > WIDTH) this.x = 0;
		if (this.x < 0) this.x = WIDTH;
	}

	display() {
		push();
		fill(this.color);
		ellipse(this.x, this.y, this.size, this.size);
		pop();
	}
}

class Light {
	constructor(x, y, radius, tree) {
    let temp = randomTreePos(tree);
		//this.x = x;
		//this.y = y;
    this.x = temp[0];
    this.y = temp[1];
		this.radius = radius;
    //this.tree = tree;
    temp = getLightColor();
		this.colorOn = lightColorOn[temp];
    this.colorOff = lightColorOff[temp];
    this.colorShine = lightColorShine[temp];
    this.on = true;
	}
	display() {
		push();
    if (this.on)
		  fill(this.colorOn);
    else
      fill(this.colorOff);
    //let temp = randomTreePos(this.tree);
    ellipse(this.x, this.y, this.radius, this.radius);

    if (this.on){
      fill(this.colorShine);
      for (let i = this.radius; i < this.radius*2; i+= this.radius/5)
		    ellipse(this.x, this.y, i, i);
    }
		//ellipse(this.x, this.y, this.radius, this.radius);
		pop();
		if(frameCount % 100 === 0) {
      this.on = !this.on;
    }
	}

}

//oh yeah i guess that works too
getLightColor = () => {
  return floor(random(lightColorOn.length))
}
/*
//Commented this heavily in case yall need to change something about it for whatever reason and cant figure out what i did lol
getLightColor = () => {
	//Array of 3 random booleans
	let colors = [Math.random() < .5, Math.random() < .5, Math.random() < .5];
	//If all 3 booleans are the same, it changes a random one (prevents white or black lights cause those are ugly)
	if(!(colors[0] || colors[1] || colors[2])) colors[floor(random(0,3))] = true;
	else if(colors[0] && colors[1] && colors[2]) colors[floor(random(0,3))] = false;
	//Changes the true/false values to 0 or 255 into a new array `colorNums`
	let colorNums = colors.map(col => {
		return col ? 255 : 0;
	});
	//Returns the 0/255 values as part of a primitive color
	return color(colorNums[0], colorNums[1], colorNums[2]);
}
*/
function drawGround() {
	fill(240);
	rect(0, HEIGHT * 6 / 7, WIDTH, HEIGHT / 7);
	ellipse(0, HEIGHT * 6 / 7, WIDTH / 2, HEIGHT / 20);
	ellipse(WIDTH / 3, HEIGHT * 6 / 7, WIDTH / 2, HEIGHT / 20);
	ellipse(3 * WIDTH / 5, HEIGHT * 6 / 7, WIDTH / 2, HEIGHT / 20);
	ellipse(WIDTH, HEIGHT * 6 / 7, WIDTH / 2, HEIGHT / 20);
}

function star(x, y, radius1, radius2, npoints, light) {
  //I copied this off the p5js website and add the fills
  if(shine)
    fill(lightColorShine[2]);
  else if(light.on)
    fill(lightColorOn[2]);
  else
    fill(lightColorOff[2]);

  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;

  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a-PI/10) * radius2;
    let sy = y + sin(a-PI/10) * radius2;
    vertex(sx, sy);
    sx = x + cos(a-PI/10 + halfAngle) * radius1;
    sy = y + sin(a-PI/10 + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}