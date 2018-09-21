function ObjectManager(ctx, canvas, mouse)
{
    // Private fields
    var defaultBallRadius = 5;

    // Public fields
    this.paddle;
    this.bricks;
    this.balls;
    this.walls;
    this.fallingPowerups;

    // Public methods
    this.initAll = function()
    {
        this.initPaddle();
        this.initWalls();
        this.initBricks();
        this.initBalls();
        this.initPowerups();
    }

    // These should not be called from the outside, but I had to declare them public
    // so that they could properly initialize the public fields
    this.initPaddle = function()
    {
        this.paddle = new Paddle(canvas, mouse);
    }

    this.initPowerups = function()
    {
        this.fallingPowerups = [];
    }

    this.initBalls = function()
    {
        // Clear the balls list
        this.balls = [];
        xPosition = canvas.width / 2 - defaultBallRadius;
        yPosition = canvas.height / 2 - defaultBallRadius;
        this.balls.push(new Ball(xPosition, yPosition, defaultBallRadius, ctx));
    }

    this.initWalls = function()
    {
        var leftWall = new Wall(0,0,0, canvas.height, "left", ctx);
        var rightWall = new Wall(canvas.width, 0, 0, canvas.height, "right", ctx);
        var topWall = new Wall(0,0, canvas.width, 0, "top", ctx);
        this.walls = [leftWall, rightWall, topWall];
    }

    this.initBricks = function()
    {
        // Create a 2d array the size of the canvas
        // Canvas dimensions: 800x600
        this.bricks = [];
        var brickHeight = 20;
        
        // Make board 10 bricks wide
        var brickWidth = (canvas.width) / 10;
        
        var arrayHeight = (canvas.height) / brickHeight;
        var arrayWidth = 10;
        
        // Create spots for the bricks
        for(var i = 0; i < arrayWidth; i++)
        {
            this.bricks[i] = [];
            for(var j = 0; j < arrayHeight; j++)
            {
                var x = i * brickWidth;
                var y = j * brickHeight;

                this.bricks[i][j] = new Brick(x, y, brickWidth, brickHeight);
            }	
        }
        
        // Turn on the first 5 rows of bricks
        for(var i = 0; i < arrayWidth; i++)
        {
            for(var j = 0; j < 8; j++)
            {
                this.bricks[i][j].broken = false;
            }
        }
    }
}