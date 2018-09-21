// =========================== GAME LOGIC ===================================== 
// Import Classes
require(['objects/ball', 'objects/wall', 'objects/paddle', 'objects/brick', 'objects/powerup', 'managers/movemanager'], function(){

// Get the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Get the animation frame
var requestAnimFrame = 
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback)
        {
            window.setTimeout(callback, 1000/60);
		};

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackMouse, true);

// Hook up restart event
document.getElementById("restartButton").onclick = restartGame;

// Start the music
var gameMusic = document.getElementById("music_ending");
gameMusic.volume = 0.1;
gameMusic.addEventListener('ended', function(){
	this.currentTime = 0;
	this.play();
}, false);
gameMusic.play();

// Declare game objects
mouse = {};
const MAXBOUNCEANGLE = Math.PI / 12;
var playerPaddle = new Paddle(canvas, mouse);
var gameOverFlag = false;
var gameFrameID = null;
var defaultBallRadius = 5;

// Create the walls
var leftWall = new Wall(0,0,0, canvas.height, "left", ctx);
var rightWall = new Wall(canvas.width, 0, 0, canvas.height, "right", ctx);
var topWall = new Wall(0,0, canvas.width, 0, "top", ctx);
var walls = [leftWall, rightWall, topWall];

// Create the brick array
var brickArray;
initBrickArray();

// Create the powerup list
var fallingPowerups = [];

// Create list for extra balls from the MultiBall powerup
var balls = [];

// Create the balls (only 1 with no powerups)
initBalls();

// Create the manager objects
var moveManager;

// Start the game!
init();

// ======================== DECLARATIONS ========================

// ======================== EVENTS START ========================
function trackMouse(e)
{
    var rect = canvas.getBoundingClientRect();
    mouse.x = Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    mouse.y = Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
}

function restartGame()
{
	gameOverFlag = false;
	initPaddle();
	initBalls();
	initBrickArray();
	initPowerups();
	init();
	playAudio("game_start", 0.4);
	musicRestart();
}

// ======================== EVENTS END ========================

// ======================== FUNCTIONS START ===================

// State initialization
function initBalls()
{
	// Clear the balls list
	balls.length = 0;

	xPosition = canvas.width / 2 - defaultBallRadius;
	yPosition = canvas.height / 2 - defaultBallRadius;
	balls.push(new Ball(xPosition, yPosition, defaultBallRadius, ctx));
}

function initBrickArray()
{
	// Create a 2d array the size of the canvas
	// Canvas dimensions: 800x600
	brickArray = [];
	var brickHeight = 20;
	
	// Make board 10 bricks wide
	var brickWidth = (canvas.width) / 10;
	
	var arrayHeight = (canvas.height) / brickHeight;
	var arrayWidth = 10;
	
	// Create spots for the bricks
	for(var i = 0; i < arrayWidth; i++)
	{
		brickArray[i] = [];
		for(var j = 0; j < arrayHeight; j++)
		{
			var x = i * brickWidth;
			var y = j * brickHeight;

			brickArray[i][j] = new Brick(x, y, brickWidth, brickHeight);
		}	
	}
	
	// Turn on the first 5 rows of bricks
	for(var i = 0; i < arrayWidth; i++)
	{
		for(var j = 0; j < 8; j++)
		{
			brickArray[i][j].broken = false;
		}
	}
}

function initPowerups()
{
	fallingPowerups = [];
}

function initPaddle()
{
	playerPaddle = new Paddle(canvas, mouse);
}

// Game Loop
function init()
{  
	// Stop the old game
	if(gameFrameID != null)
	{
		cancelAnimationFrame(gameFrameID);
	}

	// Init the managers
	moveManager = new MoveManager(playerPaddle, balls, fallingPowerups);

    // Start frame loop
    gameFrameID = requestAnimFrame(update);
}

function update()
{  
	// If the music hasn't started, kick it on (chrome auto-play workaround)
	if(gameMusic.paused)
	{
		musicRestart();
	}

    // Keep canvas size up to date - todo scaling
    //ctx.canvas.width = window.innerWidth;
    //ctx.canvas.height = window.innerHeight;
    
    // Draw the static objects
    drawStatic();
    
    // Move the paddle, balls, and powerups
	moveManager.moveAll();

	// All balls fell off the screen
	if(balls.length == 0)
	{
		gameOver();
		return;
	}
    
    // Check for and handle collisions
    collideObjects();
    
    // Draw the paddle and ball
    drawNonStatic();
        
    // Recursive Step
	requestAnimFrame(update);
}

// Drawing
function drawStatic()
{
    drawCanvas();
    drawBricks();
}

function drawNonStatic()
{
    playerPaddle.draw(ctx);

	// Draw any extra balls
	balls.forEach(function(ball)
	{
		ball.draw(ctx);
	});

	drawPowerups();
}

function drawCanvas()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, window.innerWidth, window.innerHeight);
}

function drawPowerups()
{
	// Iterate through and draw the powerups
	fallingPowerups.forEach(function(powerup){
		powerup.draw(ctx);
	});
}

function drawBricks()
{
	// Go through the brick array and draw any non-broken bricks
	for(i = 0; i < brickArray.length; i++)
	{
		for(j = 0; j < brickArray[0].length; j++)
		{
			brickArray[i][j].draw(ctx);		
		}
	}
}

// Collision
function collideObjects()
{
	// Try to collide with the paddle
	balls.forEach(function(ball)
	{
		playerPaddle.collideBall(ball);
	});
	
	// Try to collide with any active powerups
	for(i = fallingPowerups.length - 1; i >= 0; i--)
	{
		var powerup = fallingPowerups[i];
		if(playerPaddle.collidePowerup(powerup))
		{
			applyPowerup(powerup);
			fallingPowerups.splice(i, 1);
		}
	}
    
    // Try to collide with the walls
    for(i = 0; i < walls.length; i++)
    {
		balls.forEach(function(ball)
		{
			walls[i].collide(ball);
		}); 
	}

	// Try to collide with the bricks
	balls.forEach(function(ball)
	{
		collideWithBricks(ball);
	});
}

function collideWithBricks(ball)
{
	var closestBrick = null;
	var closestDist = 99999;
	for(i = 0; i < brickArray.length; i++)
	{
		for(j = 0; j < brickArray[0].length; j++)
		{
			var currBrick = brickArray[i][j];

			// Brick is already broken so skip
			if(currBrick.broken)
			{
				continue;
			}

			// No collision so skip
			if(!brickArray[i][j].collide(ball))
			{
				continue;
			}
			
			// update the min brick
			var currDist = distanceBetweenBrickAndBall(currBrick, ball);
			if(currDist < closestDist)
			{
				closestDist = currDist;
				closestBrick = currBrick;
			}
		}
	}

	// Found a brick to rebound from!
	if(closestBrick != null)
	{
		closestBrick.rebound(ball);
		
		spawnPowerup(closestBrick);
	}
}

// Manage powerups
function applyPowerup(powerup)
{
	switch(powerup.power)
	{
		case powertypes.BIGPADDLE:
		playerPaddle.applyPowerup(powertypes.BIGPADDLE);
		break;

		case powertypes.MULTIBALL:
		if(balls.length == 1)
		{
			var ball = balls[0];
			var len = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
			var mainAngle = Math.atan2(ball.dy, ball.dx) * 180 / Math.PI;

			// Spawn second ball at an angle 20 degrees less than the main ball
			var angle1 = mainAngle - 20;
			var theta1 = angle1 * Math.PI / 180;
			var dx1 = len * Math.cos(theta1);
			var dy1 = len * Math.sin(theta1);

			// Spawn the third ball at an angle 20 degress more than the main ball
			var angle2 = mainAngle + 20;
			var theta2 = angle2 * Math.PI / 180;
			var dx2 = len * Math.cos(theta2);
			var dy2 = len * Math.sin(theta2);

			// Push the new balls into the collection
			var ball1 = new Ball(ball.x, ball.y, defaultBallRadius, ctx);
			ball1.dx = dx1;
			ball1.dy = dy1;
			balls.push(ball1);

			var ball2 = new Ball(ball.x, ball.y, defaultBallRadius, ctx);
			ball2.dx = dx2;
			ball2.dy = dy2;
			balls.push(ball2);

			playAudio("powerup_multiBall", 0.2);
		}
		break;
	}
}

function spawnPowerup(brick)
{
	// 1/5 chance to spawn a powerup
	if(Math.floor(Math.random() * 5) > 0)
		return;

	// Init the new powerup - todo: randomize this once there are more powerups
	var randomPower = Math.floor(Math.random() * 2);
	var powerType;
	switch(randomPower)
	{
		case 0:
		powerType = powertypes.BIGPADDLE;
		break;

		case 1:
		powerType = powertypes.MULTIBALL;
		break;
	}

	var powerup = new Powerup(powerType, ctx)
	powerup.init(brick);

	// Add the new powerup to the fallingPowerups list so that it starts interacting
	fallingPowerups.push(powerup);
}

function gameOver()
{      
	gameOverFlag = true;
	playAudio("game_over", 0.4);
}

// Helper functions
function distance(x1, y1, x2, y2)
{
	var a = x1 - x2;
	var b = y1 - y2;

	return Math.sqrt(a*a + b*b);
}

function distanceBetweenBrickAndBall(brick, ball)
{
	return distance(brick.centerX, brick.centerY, ball.x, ball.y);
}

function playAudio(elementId, volume)
{
	var audio = document.getElementById(elementId);
	audio.volume = volume;
	audio.play();
}

function musicStop()
{
	gameMusic.pause();
	gameMusic.currentTime = 0;
}

function musicRestart()
{
	musicStop();
	gameMusic.play();
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y,   x+w, y+h, r);
	this.arcTo(x+w, y+h, x,   y+h, r);
	this.arcTo(x,   y+h, x,   y,   r);
	this.arcTo(x,   y,   x+w, y,   r);
	this.closePath();
	return this;
}

// ======================== FUNCTIONS END =====================
});