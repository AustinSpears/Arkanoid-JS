function CollisionManager(bricks, paddle, balls, walls, fallingPowerups)
{
    // Private fields
    var defaultBallRadius = 5;

    // Public methods
    this.collideAll = function()
    {
        // Try to collide with the paddle
        balls.forEach(function(ball)
        {
            paddle.collideBall(ball);
        });
        
        // Try to collide with any active powerups
        for(i = fallingPowerups.length - 1; i >= 0; i--)
        {
            var powerup = fallingPowerups[i];
            if(paddle.collidePowerup(powerup))
            {
                applyPowerup(powerup);
                fallingPowerups.splice(i, 1);
            }
        }
        
        // Try to collide with the walls
        for(i = 0; i < walls.length; i++)
        {
            balls.forEach(function(ball)
            {
                walls[i].collide(ball);
            }); 
        }

        // Try to collide with the bricks
        balls.forEach(function(ball)
        {
            collideWithBricks(ball);
        });
    }

    // Private methods
    function collideWithBricks(ball)
    {
        var closestBrick = null;
        var closestDist = 99999;
        var closestBricki = 0;
        var closestBrickj = 0;

        // Determine the brick the ball is currently inside
        var sampleBrick = bricks[0][0];
        var balli = Math.floor(ball.x / sampleBrick.w);
        var ballj = Math.floor(ball.y / sampleBrick.h);
        var mini = Math.max(0, balli - 2);
        var maxi = Math.min(bricks.length, balli + 2);
        var minj = Math.max(0, ballj - 2);
        var maxj = Math.min(bricks[0].length, ballj + 2);

        for(i = mini; i < maxi; i++)
        {
            for(j = minj; j < maxj; j++)
            {
                var currBrick = bricks[i][j];

                // Brick is already broken so skip
                if(currBrick.broken)
                {
                    continue;
                }

                // No collision so skip
                if(!bricks[i][j].collide(ball))
                {
                    continue;
                }
                
                // update the min brick
                var currDist = distanceBetweenBrickAndBall(currBrick, ball);
                if(currDist < closestDist)
                {
                    closestDist = currDist;
                    closestBrick = currBrick;
                    closestBricki = i;
                    closestBrickj = j;
                }
            }
        }

        // Found a brick to rebound from!
        if(closestBrick != null)
        {
            closestBrick.rebound(ball);
            
            if(closestBrick.broken)
            {
                spawnPowerup(closestBrick);
            }

            // Explode the bricks around the closest brick
            if(ball.onFire)
            {
                ball.stopFire();
                explodeBricks(closestBricki, closestBrickj);
            }
        }
    }

    // Manage powerups
    function applyPowerup(powerup)
    {
        switch(powerup.power)
        {
            case powertypes.BIGPADDLE:
            paddle.applyPowerup(powertypes.BIGPADDLE);
            break;

            case powertypes.MULTIBALL:
            if(balls.length == 1)
            {
                var ball = balls[0];
                var len = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                var mainAngle = Math.atan2(ball.dy, ball.dx) * 180 / Math.PI;

                // Spawn second ball at an angle 20 degrees less than the main ball
                var angle1 = mainAngle - 20;
                var theta1 = angle1 * Math.PI / 180;
                var dx1 = len * Math.cos(theta1);
                var dy1 = len * Math.sin(theta1);

                // Spawn the third ball at an angle 20 degress more than the main ball
                var angle2 = mainAngle + 20;
                var theta2 = angle2 * Math.PI / 180;
                var dx2 = len * Math.cos(theta2);
                var dy2 = len * Math.sin(theta2);

                // Push the new balls into the collection
                var ball1 = new Ball(ball.x, ball.y, defaultBallRadius);
                ball1.dx = dx1;
                ball1.dy = dy1;
                balls.push(ball1);

                var ball2 = new Ball(ball.x, ball.y, defaultBallRadius);
                ball2.dx = dx2;
                ball2.dy = dy2;
                balls.push(ball2);

                playAudio("sounds/Powerup_MultiBall.wav", 0.2);
            }
            break;

            case powertypes.FIREBALL:
            // Set fire to the balls
            balls.forEach(function(ball){
                ball.setFire();
            });

            playAudio("sounds/Powerup_FireBall.flac", 0.2);
            break;
        }
    }

    function spawnPowerup(brick)
    {
        // 1/3 chance to spawn a powerup
        if(Math.floor(Math.random() * 3) > 0)
            return;

        // Init the new powerup - todo: randomize this once there are more powerups
        var randomPower = Math.floor(Math.random() * 3);
        var powerType;
        switch(randomPower)
        {
            case 0:
            powerType = powertypes.BIGPADDLE;
            break;

            case 1:
            powerType = powertypes.MULTIBALL;
            break;

            case 2:
            powerType = powertypes.FIREBALL;
            break;
        }

        var powerup = new Powerup(powerType)
        powerup.init(brick);

        // Add the new powerup to the fallingPowerups list so that it starts interacting
        fallingPowerups.push(powerup);
    }

    function explodeBricks(i, j)
    {
        var explosionRadius = 1;

        var fromI = Math.max(0, i - explosionRadius);
        var toI = Math.min(bricks.length - 1, i + explosionRadius);

        var fromJ = Math.max(0, j - explosionRadius);
        var toJ = Math.min(bricks[0].length - 1, j + explosionRadius);

        for(k = fromI; k <= toI; k++)
        {
            for(l = fromJ; l <= toJ; l++)
            {
                var xBrick = bricks[k][l];
                if(xBrick.brickType != bricktypes.GOLD)
                {
                    xBrick.broken = true;
                }
            }
        }

        playAudio("sounds/Explosion_Grainy.wav", 0.3);
    }

    // Helper functions
    function distance(x1, y1, x2, y2)
    {
        var a = x1 - x2;
        var b = y1 - y2;

        return Math.sqrt(a*a + b*b);
    }

    function distanceBetweenBrickAndBall(brick, ball)
    {
        return distance(brick.centerX, brick.centerY, ball.x, ball.y);
    }
}