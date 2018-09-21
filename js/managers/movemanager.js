function MoveManager(paddle, ballsList, powerupsList)
{
    // Private variables
    var playerPaddle = paddle;
    var balls = ballsList;
    var fallingPowerups = powerupsList;

    // Public methods
    this.moveAll = function()
    {
        // Move the paddle
        playerPaddle.move();

        // Move the balls
        balls.forEach(function(ball)
        {
            ball.move();
        });

        // Eliminate balls that went off the canvas
        for(i = balls.length - 1; i >= 0; i--)
        {
            if(balls[i].y > canvas.height)
            {
                balls.splice(i, 1);
            }
        }

        movePowerups();
    }

    // Private methods
    function movePowerups()
    {
        for(i = fallingPowerups.length - 1; i >= 0; i--)
        {
            var powerup = fallingPowerups[i];
            powerup.y = powerup.y + powerup.dy;
    
            // Powerup went off gameboard
            if(powerup.y > canvas.height)
            {
                fallingPowerups.splice(i, 1);
            }
        }
    }
}