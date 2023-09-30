/*
The Final Game Project
by:Swen Chan
*/

/*	
Problem:
1.after death of the character, press space will cause the window scrolling.

*/

/*
The next stage is to extend your code by adding up to three of the extensions 
which are demonstrated in the final topic:

1. Add sounds Use p5.sound to add sound effects to your game. 
2. Create platforms Use the factory pattern to create platforms. 
3. Create enemies Use a constructor function to create enemies. 
*/

let imgh;
let imge;
function preload(){
	imgh = loadImage('heart.png');
	imge = loadImage('enemy-remove.png');

	soundFormats('mp3','wav');

	backSound = loadSound('background_music/gamemusic1.mp3');
	backSound.setVolume(0.1);

	runSound = loadSound('background_music/running.mp3');
	runSound.setVolume(0.1);

	jumpSound = loadSound('background_music/jump.mp3');
	jumpSound.setVolume(0.1);

	fallSound = loadSound('background_music/fall.mp3');
	fallSound.setVolume(0.1);

	startSound = loadSound('background_music/game_start.mp3');
	startSound.setVolume(0.1);

	collectSound = loadSound('background_music/collectable');
	collectSound.setVolume(0.1);

	winSound = loadSound('background_music/wow.mp3');
	winSound.setVolume(0.1);

	loseSound = loadSound('background_music/lose.mp3');
	loseSound.setVolume(0.1);

}

var gameCha_x;
var gameCha_y;
var floorP_y;

var isL;
var isR;
var isF;
var isJ;
var isD;

var cany;
var isF_cany;

var collectables;

var platforms = [];

var treePos_x;
var treePos_y;
var clouds;
var mountains;
var cameraPosX;
var cameraPosY;

var game_score;
var flagpole;

var lives;

var back;

var enemies;

function setup()
{
	createCanvas(1024, 576);
	floorP_y = height * 3/4;
	lives = 3;

	startGame();
	
}

function startGame(){
	backSound.play();
	if (!backSound.isPlaying()) {
		backSound.play();
	 }

	gameCha_x = width/2;
	gameCha_y = floorP_y;

	isL = false;
	isR = false;
	isF = false;
	isJ = false;
	isF_cany = false;
	baseline_y = floorP_y;

	//canyon natures
	cany =[
		{ x_pos: 200, width: 100},
		{x_pos: 700, width: 80},
		{x_pos: 1100, width: 130},
		{x_pos: 1300, width: 110}
	];

	//collectables natures
	collectables = [
		{x_pos: 80, y_pos: floorP_y - 100, size: 40, isF:false},
		{x_pos: 450, y_pos: floorP_y - 150, size: 40, isF:false},
		{x_pos: 600, y_pos: floorP_y - 50, size: 50, isF:false},
		{x_pos: 740, y_pos: floorP_y - 400, size: 50, isF:false},
		{x_pos: 900, y_pos: floorP_y - 180, size: 50, isF:false},
		{x_pos: 1000, y_pos: floorP_y - 50, size: 50, isF:false},
		{x_pos: 1200, y_pos: floorP_y - 50, size: 50, isF:false},
		{x_pos: 1450, y_pos: floorP_y - 300, size: 50, isF:false},
		{x_pos: 1700, y_pos: floorP_y - 100, size: 50, isF:false},
		{x_pos: 1700, y_pos: floorP_y - 150, size: 50, isF:false},
		{x_pos: 1700, y_pos: floorP_y - 200, size: 50, isF:false},
	];

	//initialise underground variables
	treePos_x = [100, 300, 650, 1050];
	treePos_y = 282;
	clouds = {x_pos:[200, 400, 700, 950, 1300, 1550, 1900], y_pos:[100, 80, 50, 85, 100, 65, 80], 
			width:[145, 120, 100, 110, 90, 120, 120, 100], height:[45, 30, 20, 35, 40, 30, 30, 50]};
	mountains = {x_pos:[150, 400, 920, 1300, 1600, 1900], height:[130, 200, 250, 190, 220, 150, 230],
			 width:[100, 80, 130, 110, 100, 130, 110]};


	platforms.push(new Platform(430, 320, 200));
	platforms.push(new Platform(550, 250, 150));
	platforms.push(new Platform(790, 300, 180));
	platforms.push(new Platform(1000, 280, 170));
	platforms.push(new Platform(1200, 200, 50));
	platforms.push(new Platform(1400, 230, 130));

	
	cameraPosX = 0;
	cameraPosY = 0;
	
	game_score = 0;
	flagpole = {
		x_pos: 2000,
		isReached:false
	}

	enemies = [];

	enemies.push(new Enemy(0, floorP_y - 10, 200));
	enemies.push(new Enemy(1550, floorP_y - 50, 200));
	enemies.push(new Enemy(1250, floorP_y - 10, 150));
}

function draw()
{


	///////////DRAWING CODE//////////

	background(100,155,255); 

	noStroke();
	fill(0,155,0);
	rect(0, floorP_y, width, height - floorP_y); //draw green ground

	///save state///
	push();
	//modify camera's position
	const newCameraPosX = gameCha_x - width / 2;
	cameraPosX = cameraPosX * 0.95 + newCameraPosX * 0.05;

	const newCameraPosY = gameCha_y - floorP_y + 20;
	cameraPosY = cameraPosY * 0.945 + newCameraPosY * 0.055;

	translate(-cameraPosX, 0);

	//draw the cany
	noStroke();
	fill(20,20,10);
	drawCanyon(cany);

	//draw trees
	noStroke();
	drawTrees();

	//draw clouds
	fill(240);
	drawClouds();

	//draw mountains
	fill(100,100,0);
	drawMountains();

	//check alive
	if(lives < 1){
		fill(0);
		textSize(45);
		text("Game over. Press space to play again.", gameCha_x - 400, height/2);
		
		if(key == " "){
			setup();
		}
		return;//in case continue the logic part.
	}

	//if the character on the cany,fall into
	for (i=0; i < cany.length; i++){
		checkCanyon(cany[i]);
		drawCanyon(cany[i]);
	}

	//draw collectables
	for(i=0; i < collectables.length; i++){
		if(!collectables[i].isF){
			//change the 'isF' variable if the collectable is found
			checkCollectable(collectables[i]);
			//draw the collectable
			drawCollectable(collectables[i]);
		}
	}

	//draw platforms
	platforms.forEach(p => p.drawPlatform());

	//the game character
	if(isL && isF)
	{
		// add your jumping-left code
		fill(100,0,200);//head
		ellipse(gameCha_x - 11, gameCha_y - 60, 24, 24);
	
		fill(200,0,0);//body
		rect(gameCha_x - 20, gameCha_y - 48, 18, 20);
	
		fill(0);//right foot
		rect(gameCha_x - 4, gameCha_y - 28, 10, 10);
	
		rect(gameCha_x - 22, gameCha_y - 28, 10, 10);//left foot
	
		rect(gameCha_x - 2, gameCha_y - 40, 10, 3);//arm
	

	}
	else if(isR && isF)
	{
		// add your jumping-right code
		fill(100,0,200);//head
		ellipse(gameCha_x + 11, gameCha_y - 60, 24, 24);
	
		fill(200,0,0);//body
		rect(gameCha_x + 2, gameCha_y - 48, 18, 20);
	
		fill(0);//right foot
		rect(gameCha_x + 12, gameCha_y - 28, 10, 10);
	
		rect(gameCha_x - 6, gameCha_y - 28, 10, 10);//left foot
	
		rect(gameCha_x - 8, gameCha_y - 43, 10, 3);
	}
	else if(isL)
	{
		// add your walking left code
		fill(100,0,200);//head
		ellipse(gameCha_x - 11, gameCha_y - 50, 24, 24);

		fill(200,0,0);//body
		rect(gameCha_x - 20, gameCha_y - 38, 18, 30);

		fill(0);//right foot
		rect(gameCha_x - 4, gameCha_y - 8, 10, 10);

		rect(gameCha_x - 22, gameCha_y - 8, 10, 10);//left foot

	}
	else if(isR)
	{
		// add your walking right code
		fill(100,0,200);//head
		ellipse(gameCha_x + 11, gameCha_y - 50, 24, 24);

		fill(200,0,0);//body
		rect(gameCha_x + 2, gameCha_y - 38, 18, 30);

		fill(0);//right foot
		rect(gameCha_x + 12, gameCha_y - 8, 10, 10);

		rect(gameCha_x - 6, gameCha_y - 8, 10, 10);//left foot

	}
	else if(isF || isJ)
	{
		// add your jumping facing forwards code
		fill(100,0,200);//head
		ellipse(gameCha_x, gameCha_y - 60, 24, 24);
	
		fill(200,0,0);//body
		rect(gameCha_x - 9, gameCha_y - 48, 18, 20);
	
		fill(0);//right foot
		rect(gameCha_x + 4, gameCha_y - 28, 10, 10);
	
		rect(gameCha_x - 14, gameCha_y - 28, 10, 10);//left foot
	
		rect(gameCha_x + 9, gameCha_y - 40, 10, 3);//right arm
		rect(gameCha_x - 19, gameCha_y - 40, 10, 3);//left arm
	}
	else
	{
		// add your standing front facing code
		fill(100,0,200);//head
		ellipse(gameCha_x, gameCha_y - 50, 24, 24);
	
		fill(200,0,0);//body
		rect(gameCha_x - 9, gameCha_y - 38, 18, 30);
	
		fill(0);//right foot
		rect(gameCha_x + 4, gameCha_y - 8, 10, 10);
	
		rect(gameCha_x - 14, gameCha_y - 8, 10, 10);//left foot

	}
	
	//draw flagpole
	renderFlagpole();
	if(!flagpole.isReached){
		checkFlagpole();
	}

	//draw enemies
	for(var i = 0;i < enemies.length; i++){
		enemies[i].draw();

		var isContact = enemies[i].checkContact(gameCha_x, gameCha_y);

		if(isContact){
			if(lives > 0){
				lives -= 1;
				startGame();
				break;
			}
		}
	}
	
	///restore state///
	pop();

	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
	if(isL){
		gameCha_x -= 5;
	}

	if(isR){
		gameCha_x += 5;
	}

	//decide the isF variable
	if(gameCha_y < floorP_y){
		isF = true;
		for(let i = 0; i < platforms.length; i++){
			if(platforms[i].contact()){
				isF = false;
				break;
			}
		}
		if(isF){
			gameCha_y += 5;
			if(gameCha_y >= floorP_y){
				gameCha_y = floorP_y;
				isF = false;
			}
		}
	}

	//limit move after falling in the cany
	if (isF_cany == true){
		isL = false;
		isR = false;
	}

	//display score
	fill(255);
	noStroke();
	text("score:" , 20, 20);
	fill(50,50,0);
	stroke(5);
	text(game_score, 100, 22);

	//check death and display lives
	checkPlayerDie();
	fill(255);
	noStroke();
	textSize(25);
	text("lives:",20,50);
	for(var i = 0;i < lives;i++){
		image(imgh,90 + i * 25,35,20,20);
	}
}

///key control set///

function keyPressed()
{
	//when the character is not falling into the canyon
	if(!isF_cany){
		if(key == 'a'){
			isL = true;	
			runSound.play();
		}
	
		if(key == 'd'){
			isR = true;
			runSound.play();
		}

		//when the character is not falling, with pressing the up key-"w",
		//the character will plumpting
		if(key == 'w'){
			if(!isF){
				gameCha_y -= 150;;
				isF = true;
				jumpSound.play();
			}
		}
	}
}

//when the key released, let the relative variables apply to false
function keyReleased()
{
	if(key == 'a'){
		isL = false;
	}

	if(key == 'd'){
		isR = false;
	}
}

/////clouds mountains and trees drawing functions/////

function drawClouds()
{
	for(var i = 0; i < clouds.x_pos.length; i++) {
		ellipse(clouds.x_pos[i], clouds.y_pos[i],
			clouds.width[i], clouds.height[i]);
		ellipse(clouds.x_pos[i] - 15, clouds.y_pos[i],
			clouds.width[i] / 2, 4 * clouds.height[i] / 3);
		ellipse(clouds.x_pos[i] + 15,clouds.y_pos[i],
			clouds.width[i] / 2, 4 * clouds.height[i] / 3);
	}
}

function drawMountains()
{
	for(var i = 0; i < mountains.x_pos.length; i++){
		triangle(mountains.x_pos[i], floorP_y - mountains.height[i],
			mountains.x_pos[i] - mountains.width[i] / 2, floorP_y,
			mountains.x_pos[i] + mountains.width[i] / 2, floorP_y
		);
		triangle(mountains.x_pos[i] - mountains.width[i] / 4, floorP_y - mountains.height[i] * 0.75,
			mountains.x_pos[i] - 3 * mountains.width[i] / 4, floorP_y,
			mountains.x_pos[i] + mountains.width[i] / 4, floorP_y);
		triangle(mountains.x_pos[i] + mountains.width[i] / 4, floorP_y - mountains.height[i] * 0.75,
			mountains.x_pos[i] + 3 * mountains.width[i] / 20, floorP_y,
			mountains.x_pos[i] + 3 * mountains.width[i] / 4, floorP_y);
	}
}

function drawTrees()
{
	for(i=0; i < treePos_x.length; i++){
		noStroke();
		fill(150,100,100);
		rect(treePos_x[i], treePos_y + 58, 40, 92);
		
		//branches
		fill(0,100,0);
		triangle(treePos_x[i] - 20, treePos_y + 58,
			treePos_x[i] + 20, treePos_y + 8,
			treePos_x[i] + 60, treePos_y + 58);
		triangle(treePos_x[i] - 20, treePos_y + 38,
			treePos_x[i] + 20, treePos_y - 12,
			treePos_x[i] + 60, treePos_y + 38);
		stroke(100,0,0);
		strokeWeight(6);

		// fruits
		point(treePos_x[i] + 10, treePos_y + 18);
		point(treePos_x[i] + 25, treePos_y + 18);
		point(treePos_x[i] + 5, treePos_y + 40);
		point(treePos_x[i] + 30, treePos_y + 43);	
		noStroke();	
	}

}

///collectable check and draw functions///

function drawCollectable(t_collectable)
{
	if(!t_collectable.isF){
		noStroke();
		fill(255,215,0);
		rect(t_collectable.x_pos, t_collectable.y_pos + t_collectable.size / 4,
			t_collectable.size / 2, t_collectable.size / 2);
		rect(t_collectable.x_pos - t_collectable.size / 4, t_collectable.y_pos + t_collectable.size / 2,
			t_collectable.size, t_collectable.size / 2);
	}
}

function checkCollectable(t_collectable)
{
	if(dist(gameCha_x, gameCha_y, t_collectable.x_pos, t_collectable.y_pos + 50) < t_collectable.size ){
		game_score += 1;
		t_collectable.isF = true;
		collectSound.play();
	}
}

function Platform(x, y, l){
	this.x = x;
	this.y = y;
	this.length = l;

	this.drawPlatform = function(){
		push();
		fill(255, 0, 0, 160);
		rect(this.x, this.y, this.length, 15);
		pop();
	}

	this.contact = function(){
		if(isF){
			if(gameCha_x + 9 > this.x && gameCha_x - 9 < this.x + this.length &&
				gameCha_y  > this.y - 4 && gameCha_y < this.y){
					return true;
				}
		}
		return false;
	}
}

///canyon check and draw functions///

function drawCanyon(t_canyon)
{
	// rect(t_canyon.x_pos, floorP_y, t_canyon.width, 144);
	fill(211);
	rect(t_canyon.x_pos, floorP_y, t_canyon.width, 150);
	fill(133,205,250);
	rect(t_canyon.x_pos + t_canyon.width * 0.1, floorP_y, t_canyon.width * 0.8, 150);
}

function checkCanyon(t_canyon)
{
	if(gameCha_x > t_canyon.x_pos && gameCha_x < t_canyon.x_pos + t_canyon.width
		&& gameCha_y >= floorP_y){
			isF_cany = true;
		}
	if(isF_cany){
		gameCha_y += 5;
		isL = false;
		isR = false;
		fallSound.play();
	}
}

///flagpole check and draw functions///

function renderFlagpole(){
	strokeWeight(5);
	stroke(200);
	line(flagpole.x_pos, floorP_y, flagpole.x_pos, floorP_y - 250);
	fill(255,0,255);
	noStroke();
	if(flagpole.isReached){
		rect(flagpole.x_pos,floorP_y - 250, 70, 50);
		checkWin();
	}
	else{
		rect(flagpole.x_pos,floorP_y - 50, 70, 50);
	}
}

function checkFlagpole(){
	var d = abs(gameCha_x - flagpole.x_pos);
	if(d < 15){
		flagpole.isReached = true;
	}
}

///check death and victory///

function checkPlayerDie(){
	if(gameCha_y > height){
		lives -= 1;
		if(lives > 0){
			startGame();
		}
	}
}

function checkWin(){
	if(flagpole.isReached){
		fill(0);
		textSize(45);
		if(game_score == collectables.length){
			text("You Win !",gameCha_x - 100, height/2);
			keyPressed = false;
			backSound.pause();
			winSound.play();
			loseSound.play();
			return;
		}
		else{
			text("You lose for unfull score!", gameCha_x - 100, height/2);
			keyPressed = false;
			backSound.pause();
			loseSound.play();
			loseSound.pause();
			return;
		}

	}
}

function Enemy(x, y, range){
	this.x = x;
	this.y = y;
	this.range = range;

	this.currentx = x;
	this.inc = 1;

	this.update = function(){
		this.currentx += this.inc;

		if(this.currentx >= this.x + this.range){
			this.inc = -1;
		}
		else if(this.currentx <= this.x){
			this.inc = 1;
		}
	}

	this.draw = function(){
		this.update();
		fill(255,0,0);
		image(imge, this.currentx, this.y - 45, 45, 45);
	}

	this.checkContact = function(){
		var d = dist(gameCha_x - 20, gameCha_y, this.currentx, this.y);
		if(d < 40){
			return true;
		}
		return false;
	}

}
