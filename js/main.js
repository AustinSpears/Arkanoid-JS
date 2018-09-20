// =========================== GAME LOGIC ===================================== 
// Import Classes
require(['objects/ball', 'objects/wall', 'objects/paddle', 'objects/brick', 'objects/powerup'], function(){
    
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

// Declare game objects
mouse = {};
const MAXBOUNCEANGLE = Math.PI / 12;
var playerPaddle = new Paddle(canvas, ctx, mouse);

// Create the walls
var leftWall = new Wall(0,0,0, canvas.height, "left", ctx);
var rightWall = new Wall(canvas.width, 0, 0, canvas.height, "right", ctx);
var topWall = new Wall(0,0, canvas.width, 0, "top", ctx);
var walls = [leftWall, rightWall, topWall];

// Create the ball
var ballRadius = 5;
initBallPosition();

// Create the brick array
var brickArray;
initBrickArray();

// Create the powerup list
var fallingPowerups = [];

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
	initPaddle();
	initBallPosition();
	initBrickArray();
	initPowerups();
}
// ======================== EVENTS END ========================

// ======================== FUNCTIONS START ===================

// State initialization
function initBallPosition()
{
	xPosition = canvas.width / 2 - ballRadius;
	yPosition = canvas.height / 2 - ballRadius;
	mainBall = new Ball(xPosition, yPosition, ballRadius, ctx);
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
	playerPaddle = new Paddle(canvas, ctx, mouse);
}

// Game Loop
function init()
{  
    // Start frame loop
    requestAnimFrame(update);
}

function update()
{  
    // Keep canvas size up to date - todo scaling
    //ctx.canvas.width = window.innerWidth;
    //ctx.canvas.height = window.innerHeight;
    
    // Draw the static objects
    drawStatic();
    
    // Move the paddle and ball
    moveObjects();
    
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
    playerPaddle.draw();
	mainBall.draw();
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
		powerup.draw();
	});
}

function drawBricks()
{
	// Go through the brick array and draw any non-broken bricks
	for(i = 0; i < brickArray.length; i++)
	{
		for(j = 0; j < brickArray[0].length; j++)
		{
			drawBrick(i,j);			
		}
	}
}

function drawBrick(x, y)
{
	// Get the brick
	var brick = brickArray[x][y];
	
	// No need to draw broken brick
	if(brick.broken)
		return;
	
	// Draw the brick at array position (x,y)
	ctx.fillStyle = brick.c;
	ctx.strokeStyle = "white";
	ctx.lineWidth = 1;
	ctx.fillRect((x * brick.w), (y * brick.h), brick.w, brick.h);
	ctx.strokeRect((x * brick.w), (y * brick.h), brick.w, brick.h);

	// Reset the drawing context properties
	ctx.strokeStyle = "black";
	ctx.lineWidth = 0;
}

// Movement
function moveObjects()
{
    // Move the paddle
    playerPaddle.move();
    
    // Move the ball
	mainBall.move();
	
	movePowerups();
}

function movePowerups()
{
	for(i = fallingPowerups.length - 1; i >= 0; i--)
	{
		var powerup = fallingPowerups[i];
		powerup.y = powerup.y + powerup.dy;

		// Powerup went off gameboard
		if(powerup.y > 800)
		{
			fallingPowerups.splice(i, 1);
		}
	}
}

// Collision
function collideObjects()
{
    // Try to collide with the paddle
	playerPaddle.collideBall(mainBall);
	
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
        walls[i].collide(mainBall);
	}

    // Try to collide with the bricks
	collideWithBricks();
}

function collideWithBricks()
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
			if(!brickArray[i][j].collide(mainBall))
			{
				continue;
			}
			
			// update the min brick
			var currDist = distanceBetweenBrickAndBall(currBrick, mainBall);
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
		closestBrick.rebound(mainBall);
		
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
	}
}

function spawnPowerup(brick)
{
	// 1/5 chance to spawn a powerup
	if(Math.floor(Math.random() * 5) > 0)
		return;

	// Init the new powerup - todo: randomize this once there are more powerups
	var powerup = new Powerup(powertypes.BIGPADDLE, ctx)
	powerup.init(brick);

	// Add the new powerup to the fallingPowerups list so that it starts interacting
	fallingPowerups.push(powerup);
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

// ======================== FUNCTIONS END =====================
});