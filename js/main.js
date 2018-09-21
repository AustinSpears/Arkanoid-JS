// =========================== GAME LOGIC ===================================== 
// Import Classes
require(['objects/ball', 'objects/wall', 'objects/paddle', 'objects/brick', 'objects/powerup', 
	'managers/movemanager', 'managers/drawmanager', 'managers/collisionManager'], function(){

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
var paddle = new Paddle(canvas, mouse);
var gameOverFlag = false;
var gameFrameID = null;
var defaultBallRadius = 5;

// Create the walls
var leftWall = new Wall(0,0,0, canvas.height, "left", ctx);
var rightWall = new Wall(canvas.width, 0, 0, canvas.height, "right", ctx);
var topWall = new Wall(0,0, canvas.width, 0, "top", ctx);
var walls = [leftWall, rightWall, topWall];

// Create the brick array
var bricks;
initBrickArray();

// Create the powerup list
var fallingPowerups = [];

// Create list for extra balls from the MultiBall powerup
var balls = [];

// Create the balls (only 1 with no powerups)
initBalls();

// Create the manager objects
var moveManager;
var drawManager;
var collisionManager;

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
	bricks = [];
	var brickHeight = 20;
	
	// Make board 10 bricks wide
	var brickWidth = (canvas.width) / 10;
	
	var arrayHeight = (canvas.height) / brickHeight;
	var arrayWidth = 10;
	
	// Create spots for the bricks
	for(var i = 0; i < arrayWidth; i++)
	{
		bricks[i] = [];
		for(var j = 0; j < arrayHeight; j++)
		{
			var x = i * brickWidth;
			var y = j * brickHeight;

			bricks[i][j] = new Brick(x, y, brickWidth, brickHeight);
		}	
	}
	
	// Turn on the first 5 rows of bricks
	for(var i = 0; i < arrayWidth; i++)
	{
		for(var j = 0; j < 8; j++)
		{
			bricks[i][j].broken = false;
		}
	}
}

function initPowerups()
{
	fallingPowerups = [];
}

function initPaddle()
{
	paddle = new Paddle(canvas, mouse);
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
	moveManager = new MoveManager(paddle, balls, fallingPowerups);
	drawManager = new DrawManager(ctx, bricks, paddle, balls, fallingPowerups);
	collisionManager = new CollisionManager(bricks, paddle, balls, fallingPowerups, walls);

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
    
	// Draw the static objects
	drawManager.drawStatic();
    
    // Move the objects
	moveManager.moveAll();

	// All balls fell off the screen
	if(balls.length == 0)
	{
		gameOver();
		return;
	}
    
    // Check for and handle collisions
	collisionManager.collideAll();
	
	// Draw the non-static objects
	drawManager.drawNonStatic();
        
    // Recursive Step
	requestAnimFrame(update);
}

function gameOver()
{      
	gameOverFlag = true;
	playAudio("game_over", 0.4);
}

// Helper functions
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