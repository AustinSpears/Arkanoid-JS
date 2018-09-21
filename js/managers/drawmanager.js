function DrawManager(drawingContext, brickCollection, playerPaddle, ballCollection, powerupCollection)
{
    // Private variables
    var ctx = drawingContext;
    var bricks = brickCollection;
    var paddle = playerPaddle;
    var balls = ballCollection;
    var fallingPowerups = powerupCollection;


    // Public methods
    this.drawStatic = function()
    {
        drawCanvas();
        drawBricks();
    }

    this.drawNonStatic = function()
    {
        paddle.draw(ctx);

        // Draw any extra balls
        balls.forEach(function(ball)
        {
            ball.draw(ctx);
        });

        drawPowerups();
    }

    // Private methods
    function drawCanvas()
    {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0, window.innerWidth, window.innerHeight);
    }

    function drawPowerups()
    {
        // Iterate through and draw the powerups
        fallingPowerups.forEach(function(powerup){
            powerup.draw(ctx);
        });
    }

    function drawBricks()
    {
        // Go through the brick array and draw any non-broken bricks
        for(i = 0; i < bricks.length; i++)
        {
            for(j = 0; j < bricks[0].length; j++)
            {
                bricks[i][j].draw(ctx);		
            }
        }
    }
}