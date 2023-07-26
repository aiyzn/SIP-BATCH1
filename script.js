var blockSize = 17;
var total_row = 30; //total row number
var total_col = 30; //total column number
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

// Set the total number of rows and columns
var speedX = 0; //speed of snake in x coordinate.
var speedY = 0; //speed of snake in Y coordinate.

var snakeBody = [];

var color = ["yellow","yellow","red","red","blue","blue","purple","purple","green","green"];
var colorBG = "black";
var colorSnake = "white";

var foodX = [0,0,0,0,0,0,0,0,0,0];
var foodY = [0,0,0,0,0,0,0,0,0,0];

var delay = 1000;

var gameOver = false;

var k = 0;

window.onload = function () {
	// Set board height and width
	board = document.getElementById("board");
	board.height = total_row * blockSize;
	board.width = total_col * blockSize;
	context = board.getContext("2d");

	for (k = 0; k < foodX.length; k++) {
		placeFood(k);
	}
	
	document.addEventListener("keyup", changeDirection); //for movements
	// Set snake speed
	setTimeout(update, delay/10);
}

function update() {
	// Background of a Game
	context.fillStyle = colorBG;
	context.fillRect(0, 0, board.width, board.height);
	
	for (k = 0; k < foodX.length; k++) {
		// Set food color and position
		context.fillStyle = color[k];
		context.fillRect(foodX[k], foodY[k], blockSize, blockSize);
		
		if (snakeX == foodX[k] && snakeY == foodY[k]) {
			snakeBody.push([foodX[k], foodY[k]]);
			
			switch (k){
				case 0: case 1:
					placeFood(k);
					colorSnake = "yellow";
					break;
				case 2: case 3:
					if (delay > 500){
						delay-=500;
					}
					placeFood(k);
					colorSnake = "red";
					break;
				case 4: case 5:
					if (delay < 1500){
						delay+=500;
					}
					placeFood(k);
					colorSnake = "blue";
					break;
				case 6: case 7:
					for (k = 0; k < foodX.length; k++) {
						placeFood(k);
					}
					colorSnake = "purple";
					break;
				case 8: case 9:
					if (colorBG == "black"){
						colorBG = "white";
						colorSnake = "green";
						
						for (k = 0; k < foodX.length-1; k++) {
							color[k] = "green";
						}
					}
					else {
						colorBG = "black";
						colorSnake = "green";
						color = ["yellow","yellow","red","red","blue","blue","purple","purple","green","green"];
					}
					placeFood(k);
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
		colorSnake = "white";
		
		alert("Game over. Try again?")
			
		snakeX = blockSize * 5;
		snakeY = blockSize * 5;
		
		speedX = 0;
		speedY = 0;
		
		color = ["yellow","yellow","red","red","blue","blue","purple","purple","green","green"];
		colorBG = "black";
		
		snakeBody = [];
		
		for (k = 0; k < foodX.length; k++) {
			placeFood(k);
		}
		
		delay = 1000;
		
		gameOver = false;
	}
	setTimeout(update, delay/10);
}



// Movement of the Snake - We are using addEventListener
function changeDirection(e) {
	if (e.code == "ArrowUp" && speedY != 1) {
		// If up arrow key pressed with this condition...
		// snake will not move in the opposite direction
		speedX = 0;
		speedY = -1;
	}
	else if (e.code == "ArrowDown" && speedY != -1) {
		//If down arrow key pressed
		speedX = 0;
		speedY = 1;
	}
	else if (e.code == "ArrowLeft" && speedX != 1) {
		//If left arrow key pressed
		speedX = -1;
		speedY = 0;
	}
	else if (e.code == "ArrowRight" && speedX != -1) {
		//If Right arrow key pressed
		speedX = 1;
		speedY = 0;
	}
}

// Randomly place food
function placeFood(k) {

	// in x coordinates.
	foodX[k] = Math.floor(Math.random() * total_col) * blockSize;
	
	//in y coordinates.
	foodY[k] = Math.floor(Math.random() * total_row) * blockSize;
}
