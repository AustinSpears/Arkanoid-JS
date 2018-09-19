const powertypes = {
    BIGPADDLE: 'bigpaddle'
}

function Powerup(powerType, drawingContext)
{
    this.power = powerType;
    this.ctx = drawingContext;
    this.x;
    this.y;
    this.w;
    this.h;
    this.dy = 2;
    this.color = "white";

    this.init = function(brick)
    {
        // Establish dimensions
        this.w = brick.w * 0.35;
        this.h = brick.h * 0.55;

        // Establish starting position
        var widthDifference = brick.w - this.w;
        this.x = brick.x + (widthDifference / 2);
        this.y = brick.y + (brick.h / 2);
    
        // Choose color based on power type
        switch(this.power)
        {
            case powertypes.BIGPADDLE:
            this.color = "Aqua";
            break;
        }
    }

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

    this.draw = function()
    {
        this.ctx.fillStyle = this.color;

        this.ctx.roundRect(this.x, this.y, this.w, this.h, 10).fill();
        //this.ctx.fillRect(this.x, this.y, this.w, this.h);

        // Reset the drawing context properties
        this.ctx.lineWidth = 0;
    }
}