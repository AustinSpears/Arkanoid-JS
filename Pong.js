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

// Objects
mouse = {};

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackMouse, true);

// Declare events
function trackMouse(e)
{
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

// Declare classes
function Paddle()
{
    this.h = 8;
    this.w = canvas.width / 8;
    this.color = "white";
    this.x = canvas.width / 2 - this.w/2;
    this.y = canvas.height - this.h - 2;
    
    this.Draw = function Draw()
    {
        ctx.fillRect(this.x, this.y, this.w, this.h, this.color);
    };
};

function Ball()
{
    this.r = 5;
    this.color = "white";
    this.x = canvas.width / 2 - this.r;
    this.y = canvas.height / 2 - this.r;
    this.dx = 0;
    this.dy = 4;
    
    this.Draw = function Draw()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fill();
    };
};

// Declare game objects
var playerPaddle = new Paddle();
var mainBall = new Ball();


// Start the game!
init();


// Declare functions
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
    
    // Set up static objects
    drawStatic();
    
    // Move the paddle and ball
    if(mouse.x && mouse.y)
    {
        playerPaddle.x = mouse.x - playerPaddle.w/2;
    }
    
    // Draw the paddle and ball
    playerPaddle.Draw();
    mainBall.Draw();
    	
	// Recursive Step
	requestAnimFrame(update);
}

function drawStatic()
{
    drawCanvas();
    drawWalls();
}

function drawCanvas()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, window.innerWidth, window.innerHeight);
}

function drawWalls()
{
    ctx.fillStyle = "white";
    
    // Top wall
    ctx.fillRect(0,0, canvas.width, 5);
    // Left wall
    ctx.fillRect(0,0,5, canvas.height - 2);
    // Right wall
    ctx.fillRect(canvas.width - 5, 0, 5, canvas.height - 2);
}
		