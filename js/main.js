// =========================== GAME LOGIC ===================================== 
// Import Classes
require(['objects/ball', 'objects/wall', 'objects/paddle', 'objects/brick'], function(){
    
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

// Declare game objects
mouse = {};
const MAXBOUNCEANGLE = Math.PI / 12;
var playerPaddle = new Paddle(canvas, ctx, mouse);

// Create the ball
var ballRadius = 5;
var xPosition = canvas.width / 2 - ballRadius;
var yPosition = canvas.height / 2 - ballRadius;
var mainBall = new Ball(xPosition, yPosition, ballRadius, ctx);

// Create the walls
var leftWall = new Wall(0,0,0, canvas.height, "left", ctx);
var rightWall = new Wall(canvas.width, 0, 0, canvas.height, "right", ctx);
var topWall = new Wall(0,0, canvas.width, 0, "top", ctx);
var walls = [leftWall, rightWall, topWall];
var brickArray;

// Create the brick array
initBrickArray();

// Start the game!
init();

// =========================== DECLARATIONS ===================================

// Declare events ==========================
function trackMouse(e)
{
    var rect = canvas.getBoundingClientRect();
    mouse.x = Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    mouse.y = Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
}
// =========================================


// Declare functions ========================
function initBrickArray()
{
	// Create a 2d array the size of the canvas
	// Canvas height = 600
	// Canvas width = 800
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
}

function drawCanvas()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, window.innerWidth, window.innerHeight);
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
}

// Collision
function collideObjects()
{
    // Try to collide with the paddle
    playerPaddle.collide(mainBall);
    
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
	}
}

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

// =========================================
});

/* Problems to solve:

1. Collision detection between brick and ball - Done
2. Which side did the ball hit - Done
3. Recursive step to accomodate multiple collisons in a single frame

*/