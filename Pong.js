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

// Declare events
function trackMouse(e)
{
    var rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouse.y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}

// Declare classes
function Paddle()
{
    this.h = 8;
    this.w = canvas.width / 8;
    this.c = "white";
    this.x = canvas.width / 2 - this.w/2;
    this.y = canvas.height - this.h - 2;
    
    this.draw = function()
    {
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    
    this.rebound = function(ball)
    {
        ball.dy = ball.dy * -1;
    };
};

function Ball()
{
    this.r = 5;
    this.c = "white";
    this.x = canvas.width / 2 - this.r;
    this.y = canvas.height / 2 - this.r;
    this.dx = 0;
    this.dy = 4;
    
    this.draw = function()
    {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fill();
    };
};

function Wall(x, y, width, height, orientation)
{
    this.w = width;
    this.h = height;
    this.x = x;
    this.y = y;
    this.c = "white";
    this.orientation = orientation;
    
    this.draw = function()
    {
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    
    this.rebound = function(ball)
    {
        switch(orientation)
        {
            case "vertical":
            // Invert ball.dy
            ball.dy = ball.dy * -1;
            break;
            
            case "horizontal":
            // Invert ball.dx
            ball.dx = ball.dx * -1;
            break;
        }
    };
}

// Declare game objects
mouse = {};
var playerPaddle = new Paddle();
var mainBall = new Ball();
var leftWall = new Wall(0,0,5, canvas.height - 2);
var rightWall = new Wall(canvas.width - 5, 0, 5, canvas.height - 2);
var topWall = new Wall(0,0, canvas.width, 5);
var walls = [leftWall, rightWall, topWall];


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
    playerPaddle.draw();
    mainBall.draw();
    	
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
    for(i = 0; i < walls.length; i++)
    {
        walls[i].draw();
    }
}
		