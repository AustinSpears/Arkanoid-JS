// Get the canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

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

// Start the game
init();

// Declare Functions
function init()
{
	requestAnimFrame(update);
}

function update()
{
	// Establish walls
	context.fillRect(10,10,40,380, "#000000");
	context.fillRect(10,10,380,40, "#000000");
	context.fillRect(10,350,380,40, "#000000");
	context.fillRect(180,10,40,180, "#000000");
	
	// Recursive Step
	requestAnimFrame(update);
}
		