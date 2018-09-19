function Paddle(canvas, drawingContext, mouse)
{
    this.h = 8;
    this.w = canvas.width / 8;
    this.c = "white";
    this.x = canvas.width / 2 - this.w/2;
    this.y = canvas.height - this.h - 2;
    this.ctx = drawingContext;
    this.mouse = mouse;
    
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