function Paddle(canvas, drawingContext, mouse)
{
    this.h = 8;
    this.w = canvas.width / 8;
    this.c = "white";
    this.x = canvas.width / 2 - this.w/2;
    this.y = canvas.height - this.h - 2;
    this.ctx = drawingContext;
    this.mouse = mouse;
    this.big = false;

    this.applyPowerup = function(power)
    {
        switch(power)
        {
            case powertypes.BIGPADDLE:
            if(!this.big)
            {
                this.grow();
            }
            break;
        }
    }

    this.grow = function()
    {
        this.w = this.w * 2;
        this.x = this.x - this.w / 4;
        this.big = true;
    }
 
    this.move = function()
    {
        if(this.mouse.x && this.mouse.y)
        {
            this.x = this.mouse.x - this.w/2;
        }
    };
    
    this.draw = function()
    {
        this.ctx.fillStyle = this.c;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    };

    this.collidePowerup = function(powerup)
    {
        // Check whether the two rectangles are overlapping
        var horizontalOverlap = false;
        var verticalOverlap = false;

        var padMidX = this.x + (this.w / 2);
        var padMidY = this.y + (this.h / 2);

        var powMidX = powerup.x + (powerup.w / 2);
        var powMidY = powerup.y + (powerup.h / 2);

        horizontalOverlap = Math.abs(padMidX - powMidX) < (this.w + powerup.w) / 2;
        verticalOverlap = Math.abs(padMidY - powMidY) < (this.h + powerup.h) / 2;

        if(horizontalOverlap && verticalOverlap)
        {
            return true;
        }

        return false;
    }
  
    this.collideBall = function(ball)
    {
        // Ball is too high to collide
        if(ball.bottom() < this.y)
            return;
        
        // Ball is too low to collide
        if(ball.top() > this.y)
            return;
        
        // Ball is too far to the left to collide
        if(ball.right() < this.x)
            return;
        
        // Ball is too far to the right to collide
        if(ball.left() > (this.x + this.w))
            return;
            
        this.rebound(ball);
    };
    
    this.rebound = function(ball)
    {   
        var relativeIntersectX = ball.x - (this.x + (this.w/2));
        var normalizedRelativeIntersectionX = (relativeIntersectX/(this.w/2));
        var bounceAngle = normalizedRelativeIntersectionX + (Math.PI / 2);

        ball.numCollisions++;
        var ballSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        var ballSpeed = Math.min(5, ballSpeed + Math.min(2, ball.numCollisions / 5));
        
        ball.dx = ballSpeed * -Math.cos(bounceAngle);
        ball.dy = ballSpeed * -Math.sin(bounceAngle);
        
        ball.y = this.y - ball.r - 1;
    };
};