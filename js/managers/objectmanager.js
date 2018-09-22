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
        initPaddle.call(this);
        initWalls.call(this)
        initBricks.call(this);
        initBalls.call(this);
        initPowerups.call(this);
    }

    // Private methods
    function initPaddle()
    {
        this.paddle = new Paddle(canvas, mouse);
    }

    function initPowerups()
    {
        this.fallingPowerups = [];
    }

    function initBalls()
    {
        // Clear the balls list
        this.balls = [];
        xPosition = canvas.width / 2 - defaultBallRadius;
        yPosition = canvas.height / 2 - defaultBallRadius;
        this.balls.push(new Ball(xPosition, yPosition, defaultBallRadius, ctx));
    }

    function initWalls()
    {
        var leftWall = new Wall(0,0,0, canvas.height, "left", ctx);
        var rightWall = new Wall(canvas.width, 0, 0, canvas.height, "right", ctx);
        var topWall = new Wall(0,0, canvas.width, 0, "top", ctx);
        this.walls = [leftWall, rightWall, topWall];
    }

    function initBricks()
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

                this.bricks[i][j] = new Brick(x, y, brickWidth, brickHeight, "green");
            }	
        }
        

        // Enable and color some of the bricks
        for(var i = 2; i < 8; i++)
        {
            var rowColor = randomColor();
            for(var j = 0; j < arrayWidth; j++)
            {
                this.bricks[j][i].broken = false;
                this.bricks[j][i].c = rowColor;
            }
        }
    }

    function randomColor()
    {
        var colorInt = Math.floor(Math.random() * 5);
        switch(colorInt)
        {
            case 0:
                return "DarkGreen";
            case 1:
                return "SteelBlue"
            case 2:
                return "SlateBlue"
            case 3:
                return "SeaGreen"
            case 4:
                return "DarkCyan"
        }
    }
}