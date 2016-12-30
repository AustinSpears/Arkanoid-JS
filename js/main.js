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
var leftWall = new Wall(0,0,8, canvas.height - 2, "left", ctx);
var rightWall = new Wall(canvas.width - 8, 0, 8, canvas.height - 2, "right", ctx);
var topWall = new Wall(0,0, canvas.width, 8, "top", ctx);
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
	
	// Make board 10 bricks wide taking into account the walls
	var brickWidth = (canvas.width - (walls[0].w * 2)) / 10;
	
	var arrayHeight = (canvas.height - (walls[2].h)) / brickHeight;
	var arrayWidth = 10;
	
	// Create spots for the bricks
	for(var i = 0; i < arrayWidth; i++)
	{
		brickArray[i] = [];
		for(var j = 0; j < arrayHeight; j++)
		{
			brickArray[i][j] = new Brick(brickWidth, brickHeight);
		}	
	}
	
	// Turn on the first 5 rows of bricks
	for(var i = 0; i < arrayWidth; i++)
	{
		for(var j = 0; j < 5; j++)
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
    drawWalls();
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

function drawWalls()
{
    for(i = 0; i < walls.length; i++)
    {
        walls[i].draw();
    }
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
	
	// Factor the width / height of the walls into the brick placement
	ctx.fillRect((x * brick.w) + walls[0].w, (y * brick.h) + walls[2].h, brick.w, brick.h);
	ctx.strokeRect((x * brick.w) + walls[0].w, (y * brick.h) + walls[2].h, brick.w, brick.h);

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
}
// =========================================
});

		