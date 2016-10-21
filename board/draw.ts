interface iShape {
    draw(ctx:CanvasRenderingContext2D): void;
    x: number;
    y: number;
    color: string;
    lineWidth: number;
}

class cCircle implements iShape {
    public x: number = 0;
    public y: number = 0;
    public r: number = 20;
    public lineWidth: number = 1;
    public color: string = "blue";

    constructor(x: number, y: number, r: number, color: string = "blue", lineWidth: number = 1)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.lineWidth = lineWidth;
        this.color = color;
    }

    draw(ctx:CanvasRenderingContext2D): void
    {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

class cRect implements iShape {
    public x: number = 0;
    public y: number = 0;
    public w: number = 20;
    public h: number = 20;
    public lineWidth: number = 1;
    public color: string = "green";

    constructor(x: number, y: number, w: number, h:number, color: string = "blue", lineWidth: number = 1)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.lineWidth = lineWidth;
        this.color = color;
    }
    draw(ctx:CanvasRenderingContext2D): void
    {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
        ctx.restore();
    }
}

class cPoint {
    public x:number;
    public y:number;
    public color: string = "red";

    constructor(x: number = 0, y:number = 0, color: string = "red") {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    draw(ctx:CanvasRenderingContext2D): void
    {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.arc(this.x, this.y, 1, 0, 2*Math.PI);
        ctx.stroke();
        ctx.restore();
    }
}

class cGrid {
    public x: number = 0;
    public y: number = 0;
    public w:number = 1280;
    public h:number = 720;
    public n:number = 19;

    constructor(x:number, y:number, w:number, h:number, n:number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.n = n + 2;
    }
    draw(ctx:CanvasRenderingContext2D): void
    {
        var xUnit:number = this.h/this.n;
        var yUnit:number = this.w/this.n;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "firebrick";
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.lineWidth = 2;
        for(var i = 1; i < this.n; i++) {
            ctx.moveTo(this.x + xUnit, this.y + i*yUnit);
            ctx.lineTo(this.x + this.w - xUnit, this.y + i*yUnit);
            ctx.moveTo(this.x + i*xUnit, this.y + yUnit);
            ctx.lineTo(this.x + i*yUnit, this.y + this.h - yUnit);
        }
        ctx.stroke();
        ctx.restore();
    }
    getStone(x:number, y:number):cPoint
    {
        var xUnit:number = this.h/this.n;
        var yUnit:number = this.w/this.n;
        console.assert(x >= 0 && x < this.n - 1);
        console.assert(y >= 0 && y < this.n - 1);
        return new cPoint(this.x + (x + 1)*xUnit, this.y + (y + 1)*yUnit); 
    }
    getStoneRadius():number
    {
        return (Math.min(this.w,this.h)/(2*this.n)) - 1;
    }
}
