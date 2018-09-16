function Brick(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;
	this.c = "green";
	this.broken = true;

	// Return center point
	this.centerX = this.x + this.w / 2;
	this.centerY = this.y + this.h / 2;

	// Determine if the ball collides with the brick
	this.collide = function(ball)
	{
		// Find the horizontal and vertical distances between the
		// ball's center and the rectangle's center
		var distX = Math.abs(ball.x - (this.x - this.w / 2));
		var distY = Math.abs(ball.y - (this.y - this.h / 2));

		// If the distance is greater than half the brick + the circle's
		// radius, then they are too far apart to collide
		if (distX > (this.w/2 + ball.r)) 
		{ 
			return false; 
		}

		if (distY > (this.h/2 + ball.r))
		{ 
			return false; 
		}
		
		// If the distance is less than half the rectangle then they are colliding
		if (distX <= (this.w/2)) 
		{ 
			return true; 
		} 

		if (distY <= (this.h/2)) 
		{ 
			return true; 
		}
		
		// Use Pythagorean theorem to detect corner collision
		var dx=distX-this.w/2;
    	var dy=distY-this.h/2;
    	return (dx*dx+dy*dy<=(ball.r*ball.r));
	}

	// Determine the side the ball is hitting to produce the normal vector
	this.rebound = function(ball)
	{
		// Hit from below
		if(ball.y <= this.y - (this.h / 2))
		{
            ball.dy = ball.dy * -1;
            
            // Move the ball out of the brick
            ball.y = this.y + this.h + ball.r;
		}

		// Hit was from above the brick
		if(ball.y >= this.y + (this.h/2))
		{
			ball.dy = ball.dy * -1;

			// Move the ball out of the brick
			ball.y = this.y - ball.r;
		}
  		
		// Hit was on left
		if(ball.x < this.x)
		{
			ball.dx = ball.dx * -1;

			// Move the ball out of the brick
			ball.x = this.x - ball.r;
		}
  		
		// Hit was on right
		if(ball.x > this.x)
		{
			ball.dx = ball.dx * -1;

			// Move the ball out of the brick
			ball.x = this.x + this.w + ball.r;
		}	
		
		// Brick is now broken!
		this.broken = true;
	}
}
