function Wall(x, y, width, height, orientation, drawingContext)
{
    this.w = width;
    this.h = height;
    this.x = x;
    this.y = y;
    this.c = "white";
    this.orientation = orientation;
    this.ctx = drawingContext;
    
    this.draw = function()
    {
        this.ctx.fillStyle = this.c;
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    
    this.collide = function(ball)
    {
        switch(this.orientation)
        {
            case "left":
            if(ball.left() <= this.x + this.w)
                this.rebound(ball);
            break;
            
            case "right":
            if(ball.right() >= this.x)
                this.rebound(ball);
            break;
            
            case "top":
            if(ball.top() <= this.y + this.h)
                this.rebound(ball);
            break;
        }
    };
    
    this.rebound = function(ball)
    {
        switch(this.orientation)
        {
            // Invert ball.dx
            case "left":
            ball.dx = ball.dx * -1;

            // Move the ball out of the wall
            ball.x = this.x + this.w + ball.r;
            break;
            
            case "right":
            ball.dx = ball.dx * -1;

            // Move the ball out of the wall
            ball.x = this.x - ball.r;
            break;
            
            // Invert ball.dy
            case "top":
            ball.dy = ball.dy * -1;
            
            // Move the ball out of the wall
            ball.y = this.y + this.h + ball.r;
            break;
        }
    };
}