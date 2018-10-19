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
    this.initAll = function(levelArray)
    {
        initPaddle.call(this);
        initWalls.call(this)
        initBricks.call(this, levelArray);
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
        yPosition = canvas.height - 30;
        this.balls.push(new Ball(xPosition, yPosition, defaultBallRadius, ctx));
    }

    function initWalls()
    {
        var leftWall = new Wall(0,0,0, canvas.height, "left", ctx);
        var rightWall = new Wall(canvas.width, 0, 0, canvas.height, "right", ctx);
        var topWall = new Wall(0,0, canvas.width, 0, "top", ctx);
        this.walls = [leftWall, rightWall, topWall];
    }

    function initBricks(levelArray)
    {
        this.bricks = [];

        for(var a = 0; a < 10; a++)
        {
            this.bricks[a] = [];
        }

        for(var i = 0; i < levelArray.length; i++)
        {
            var levelBrick = levelArray[i];
            
            var brickType;
            switch(levelBrick.brickType)
            {
                case 0:
                brickType = bricktypes.NORMAL;
                break;

                case 1:
                brickType = bricktypes.SILVER;
                break;

                case 2:
                brickType = bricktypes.GOLD;
                break;
            }

            var newBrick = new Brick(levelBrick.x, levelBrick.y, levelBrick.w, 
                levelBrick.h, levelBrick.broken, brickType, levelBrick.c);

            newBrick.initTypeProperties();

            this.bricks[levelBrick.x / levelBrick.w][levelBrick.y / levelBrick.h] = newBrick;
        }
    }
}