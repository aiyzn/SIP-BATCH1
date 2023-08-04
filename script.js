var blockSize = 15;
var total_row = 27; //total row number
var total_col = 36; //total column number
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

// Set the total number of rows and columns
var speedX = 0; //speed of snake in x coordinate.
var speedY = 0; //speed of snake in Y coordinate.

var snakeBody = [];

var color1 = ["red","red","blue","blue","purple","purple","green","green"];
var food1X = [0,0,0,0,0,0,0,0];
var food1Y = [0,0,0,0,0,0,0,0];

var color2 = ["darkorange","yellow","yellow","yellow","yellow"];
var food2X = [0,0,0,0,0];
var food2Y = [0,0,0,0,0];

var colorBG = "rgb(32,32,32)";
var colorSnake = "rgb(223,223,223)";

var yellow = 0;
var score = 0;

var delay = 1000;

var gameOver = false;

var highScore;

//localStorage.clear(highScore);
if (localStorage.getItem(highScore) == null) {
	localStorage.setItem(highScore, "0");
}

var k = 0;
var q;

window.onload = function () {
	// Set board height and width
	board = document.getElementById("board");
	board.height = total_row * blockSize;
	board.width = total_col * blockSize;
	context = board.getContext("2d");

	for (k = 0; k < food1X.length; k++) {
		placeFood1(k);
	}
	for (k = 0; k < food2X.length; k++) {
		placeFood2(k);
	}
	food2X[0] = -1 * blockSize;
	food2Y[0] = -1 * blockSize;
	
	buttonMovement();
	document.addEventListener("keyup", keyMovement); //for movements
	// Set snake speed
	
	setTimeout(update, delay/10);
}

function update() {
	// Background of a Game
	context.fillStyle = colorBG;
	context.fillRect(0, 0, board.width, board.height);
	
	for (k = 0; k < food1X.length; k++) {
		// Set food color and position
		context.fillStyle = color1[k];
		context.fillRect(food1X[k], food1Y[k], blockSize, blockSize);
		
		if (snakeX == food1X[k] && snakeY == food1Y[k]) {
			snakeBody.push([food1X[k], food1Y[k]]);
			
			switch (k){
				case 0: case 1:
					if (delay > 500){
						delay-=500;
					}
					placeFood1(k);
					colorSnake = "rgb(255, 32, 32)";
					break;
				case 2: case 3:
					if (delay < 1500){
						delay+=500;
					}
					placeFood1(k);
					colorSnake = "rgb(32, 32, 255)";
					break;
				case 4: case 5:
					placeFood1(k);
					
					let x = Math.floor(Math.random() * 11) + 1;
					for (k = 0; k < x; k++) {
						food1X.push(food1X[0]);
						food1X.shift();
						
						food1Y.push(food1Y[0]);
						food1Y.shift();
					}
					colorSnake = "rgb(160, 32, 160)";
					break;
				case 6: case 7:
					placeFood1(k);
					if (colorBG == "rgb(32,32,32)"){
						colorBG = "rgb(223,223,223)";
						colorSnake = "rgb(32,160,32)";
						
						for (k = 0; k < food1X.length; k++) {
							color1[k] = "green";
						}
						for (k = 0; k < food2X.length; k++) {
							color2[k] = "green";
						}
					}
					else {
						colorBG = "rgb(32,32,32)";
						colorSnake = "rgb(32,160,32)";
						color1 = ["red","red","red","blue","blue","blue","purple","purple","purple","green","green","green"];
						color2 = ["orange","yellow","yellow","yellow","yellow"];
					}
					break;
			}
			reset();
		}
	}
	
	for (k = 0; k < food2X.length; k++) {
		// Set food color and position
		context.fillStyle = color2[k];
		context.fillRect(food2X[k], food2Y[k], blockSize, blockSize);
		
		if (snakeX == food2X[k] && snakeY == food2Y[k]) {
			snakeBody.push([food2X[k], food2Y[k]]);
			
			switch (k){
				case 0:
					score+=5;
					reset();
					colorSnake = "rgb(255, 197, 32)";
					break;
				case 1: case 2: case 3: case 4:
					yellow++;
					score++;
					
					food2X[k] = -1 * blockSize;
					food2Y[k] = -1 * blockSize;
					
					if (yellow == 4) {
						placeFood2(0);
					}
					
					colorSnake = "rgb(255, 255, 32)";
					break;
			}
		}
	}
	
	// body of snake will grow
	for (let i = snakeBody.length - 1; i > 0; i--) {
		// it will store previous part of snake to the current part
		snakeBody[i] = snakeBody[i - 1];
	}
	if (snakeBody.length) {
		snakeBody[0] = [snakeX, snakeY];
	}

	context.fillStyle = colorSnake;
	snakeX += speedX * blockSize; //updating Snake position in X coordinate.
	snakeY += speedY * blockSize; //updating Snake position in Y coordinate.
	context.fillRect(snakeX, snakeY, blockSize, blockSize);
	for (let i = 0; i < snakeBody.length; i++) {
		context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
	}

	if (snakeX < 0
		|| snakeX > total_col * blockSize-1
		|| snakeY < 0
		|| snakeY > total_row * blockSize-1) {
		
		// Out of bound condition
		gameOver = true;
	}

	for (let i = 0; i < snakeBody.length; i++) {
		if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
			
			// Snake eats own body
			gameOver = true;
		}
	}
	if (gameOver != false) {
		colorSnake = "rgb(223,223,223)";
		
		var hScore = parseInt(localStorage.getItem(highScore));
		
		if (score > hScore) {
			alert("Score: " + score + "          High Score: " + score + "          Cakes Eaten: " + snakeBody.length);
			localStorage.setItem(highScore, score);
		} else {
			alert("Score: " + score + "          High Score: " + hScore + "          Cakes Eaten: " + snakeBody.length);
		}
		
		snakeX = blockSize * 5;
		snakeY = blockSize * 5;
		
		speedX = 0;
		speedY = 0;
		
		color1 = ["red","red","blue","blue","purple","purple","green","green"];
		color2 = ["orange","yellow","yellow","yellow","yellow"];
		colorBG = "rgb(32,32,32)";
		
		snakeBody = [];
		
		for (k = 0; k < food1X.length; k++) {
			placeFood1(k);
		}
		for (k = 0; k < food2X.length; k++) {
			placeFood2(k);
		}
		food2X[0] = -1 * blockSize;
		food2Y[0] = -1 * blockSize;
		yellow = 0;
		score = 0;
		
		delay = 1000;
		
		gameOver = false;
	}
	setTimeout(update, delay/10);
}
function buttonMovement() {
	var ctrls = "AWDS";
	var btns = [];
	for (var i = 0; i < ctrls.length; i++) {
		var btn = document.createElement("button");
		btn.innerHTML = ctrls.charAt(i);
		btn.style.cssText = 'width: 110px; height: 110px';
		
		btns.push(btn);
		
		btns[i].onclick = function() {
			q = this.innerHTML;
			changeDirection();
		}
		
		document.getElementById("gamepad").appendChild(btns[i]);
	}
}
function keyMovement(e) {
	let w = e.key;
	switch (w){
		case "W": case "w":
			q = "W";
			break;
		case "S": case "s":
			q = "S";
			break;
		case "A": case "a":
			q = "A";
			break;
		case "D": case "d":
			q = "D";
			break;
	}
	changeDirection();
}

// Movement of the Snake - We are using addEventListener
function changeDirection() {
	switch (q){
		case "W":
			if (speedY != 1){
				speedX = 0;
				speedY = -1;
			}
			break;
		case "S":
			if (speedY != -1){
				speedX = 0;
				speedY = 1;
			}
			break;
		case "A":
			if (speedX != 1){
				speedX = -1;
				speedY = 0;
			}
			break;
		case "D":
			if (speedX != -1){
				speedX = 1;
				speedY = 0;
			}
			break;
	}
}
function reset(){
	food2X[0] = -1 * blockSize;
	food2Y[0] = -1 * blockSize;
	for (k = 1; k < food2X.length; k++) {
		placeFood2(k);
	}
	yellow = 0;
}

// Randomly place food
function placeFood1(k) {
	// in x coordinates.
	food1X[k] = Math.floor(Math.random() * total_col) * blockSize;
	
	//in y coordinates.
	food1Y[k] = Math.floor(Math.random() * total_row) * blockSize;
}

function placeFood2(k) {
	// in x coordinates.
	food2X[k] = Math.floor(Math.random() * total_col) * blockSize;
	
	//in y coordinates.
	food2Y[k] = Math.floor(Math.random() * total_row) * blockSize;
}
