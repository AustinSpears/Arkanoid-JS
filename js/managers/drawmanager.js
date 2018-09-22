function DrawManager(ctx, bricks, paddle, balls, fallingPowerups)
{
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

    // Drawing context prototype method to allow for rectangles with rounded corners
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x+r, y);
        this.arcTo(x+w, y,   x+w, y+h, r);
        this.arcTo(x+w, y+h, x,   y+h, r);
        this.arcTo(x,   y+h, x,   y,   r);
        this.arcTo(x,   y,   x+w, y,   r);
        this.closePath();
        return this;
    }
}