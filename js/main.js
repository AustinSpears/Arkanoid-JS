// =========================== GAME LOGIC ===================================== 
// Import Classes
require(['objects/ball', 'objects/wall', 'objects/paddle', 'objects/brick', 'objects/powerup', 
	'managers/movemanager', 'managers/drawmanager', 'managers/collisionmanager', 'managers/objectmanager'], function(){

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

// Initialize the mouse
mouse = {};
function trackMouse(e)
{
    var rect = canvas.getBoundingClientRect();
    mouse.x = Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    mouse.y = Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
}

// Hook up restart event
document.getElementById("restartButton").onclick = gameStart;

// Start the music
var gameMusic = document.getElementById("music_ending");
gameMusic.volume = 0.1;
gameMusic.addEventListener('ended', function(){
	this.currentTime = 0;
	this.play();
}, false);
gameMusic.play();

// Declare game objects
var gameFrameID = null;

// Declare the managers
var objMngr = new ObjectManager(ctx, canvas, mouse);
var moveManager;
var drawManager;
var collisionManager;

// Start the game!
gameStart();

// ======================== FUNCTIONS START ===================

function gameStart()
{  
	// Stop the old game
	if(gameFrameID != null)
	{
		cancelAnimationFrame(gameFrameID);
	}

	// Reset the objects to their default state
	objMngr.initAll();
	moveManager = new MoveManager(objMngr.paddle, objMngr.balls, objMngr.fallingPowerups);
	drawManager = new DrawManager(ctx, objMngr.bricks, objMngr.paddle, objMngr.balls, objMngr.fallingPowerups);
	collisionManager = new CollisionManager(objMngr.bricks, objMngr.paddle, objMngr.balls, objMngr.walls, objMngr.fallingPowerups);

    // Start frame loop
	gameFrameID = requestAnimFrame(gameLoop);
	
	// Play the start noise and kick on the music
	playAudio("game_start", 0.4);
	musicRestart();
}

function gameLoop()
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
	if(objMngr.balls.length == 0)
	{
		gameOver();
		return;
	}
    
    // Check for and handle collisions
	collisionManager.collideAll();
	
	// Draw the non-static objects
	drawManager.drawNonStatic();
        
    // Recursive Step
	requestAnimFrame(gameLoop);
}

function gameOver()
{
	playAudio("game_over", 0.4);
}

// Audio functions
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