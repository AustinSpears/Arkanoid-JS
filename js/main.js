// =========================== GAME LOGIC ===================================== 
// Import Classes
require(['objects/ball', 'objects/wall', 'objects/paddle', 'objects/brick', 'objects/powerup', 
	'managers/movemanager', 'managers/drawmanager', 'managers/collisionmanager', 'managers/objectmanager'], function(){

// Modify the object prototype to allow for any object to call playAudio
Object.prototype.playAudio = function(fileName, volume) {
	var audio = new Audio(fileName)
	audio.volume = volume;
	audio.play();
}

// Get the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Trick to avoid line blurring
ctx.translate(0.5, 0.5);

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
var gameMusic = new Audio("sounds/Music_Main.mp3");
gameMusic.volume = 0.1;
gameMusic.addEventListener('ended', function(){
	this.currentTime = 0;
	this.play();
}, false);

// Declare game objects
var gameFrameID = null;

// Declare the managers
var objMngr = new ObjectManager(ctx, canvas, mouse);
var moveManager;
var drawManager;
var collisionManager;

// ======================== FUNCTIONS START ===================

var interval = 1000 / 60;
var lastTime;
var currTime;
var delta = 0;

function gameStart()
{  
	// Stop the old game
	if(gameFrameID != null)
	{
		cancelAnimationFrame(gameFrameID);
	}

	// Hide the cursor and restart button
	canvas.style.cursor = "none";
	document.getElementById("insertCoinDiv").style.visibility = "hidden";

	// Reset the objects to their default state
	objMngr.initAll();
	moveManager = new MoveManager(objMngr.paddle, objMngr.balls, objMngr.fallingPowerups);
	drawManager = new DrawManager(ctx, objMngr.bricks, objMngr.paddle, objMngr.balls, objMngr.fallingPowerups);
	collisionManager = new CollisionManager(objMngr.bricks, objMngr.paddle, objMngr.balls, objMngr.walls, objMngr.fallingPowerups);

	// Start frame loop
	lastTime = Date.now();
	gameFrameID = requestAnimFrame(gameLoop);
	playAudio("sounds/Game_Start.ogg", 0.4);
}

function gameLoop()
{  
	// If the music hasn't started, kick it on (chrome auto-play workaround)
	if(gameMusic.paused)
	{
		musicRestart();
	}

	currTime = Date.now();
	delta = (currTime - lastTime);
	if(delta > interval)
	{
		// Draw the static objects
		drawManager.drawStatic();

		// Increasing the iterations increases the game speed
		for(var i = 0; i < 2; i++)
		{	
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
		}

		// Draw the non-static objects
		drawManager.drawNonStatic();

		lastTime = currTime - (delta % interval);
	}
    
    // Recursive Step
	requestAnimFrame(gameLoop);
}

function gameOver()
{
	gameMusic.pause();
	playAudio("sounds/Game_Over.wav", 0.4);
	
	// Show the cursor and restart button
	canvas.style.cursor = "url('images/CoinCursor.png'), auto";
	document.getElementById("insertCoinDiv").style.visibility = "visible";
}

function musicRestart()
{
	gameMusic.pause();
	gameMusic.currentTime = 0;
	gameMusic.play();
}

// ======================== FUNCTIONS END =====================
});