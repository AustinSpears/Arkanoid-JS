const powertypes = {
    BIGPADDLE: 'bigpaddle'
}

function Powerup(powerType)
{
    this.power = powerType;
    this.x;
    this.y;
    this.w;
    this.h;
    this.dy = 2;
    this.color = "white";
    this.linearGradientPosition = 0.1;
    this.lastGradientSwap;

    this.init = function(brick)
    {
        // Establish dimensions
        this.w = brick.w * 0.40;
        this.h = brick.h * 0.75;

        // Establish starting position
        var widthDifference = brick.w - this.w;
        this.x = brick.x + (widthDifference / 2);
        this.y = brick.y + (brick.h / 2);
        this.lastGradientSwap = this.y;
    
        // Choose color based on power type
        switch(this.power)
        {
            case powertypes.BIGPADDLE:
            this.color = "steelblue";
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

    this.draw = function(ctx)
    {
        var gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.h);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(Math.max(this.linearGradientPosition - 0.4, 0.1).toFixed(1), this.color);
        gradient.addColorStop(this.linearGradientPosition.toFixed(1), "white");
        gradient.addColorStop(Math.min(this.linearGradientPosition + 0.4, 0.9).toFixed(1), this.color);
        gradient.addColorStop(1, this.color);
        ctx.fillStyle = gradient;

        ctx.roundRect(this.x, this.y, this.w, this.h, 10).fill();

        // Increment the gradient position to produce a rotating effect
        if(this.y - this.lastGradientSwap > 30)
        {
            this.linearGradientPosition = this.linearGradientPosition + 0.1;
            if(this.linearGradientPosition >= 1)
            {
                this.linearGradientPosition = 0.1;
            }

            this.lastGradientSwap = this.y;
        }
    }
}