interface iShape {
    draw(ctx:CanvasRenderingContext2D): void;
    x: number;
    y: number;
    lineWidth: number;
}

class cCircle implements iShape {
    public x: number = 0;
    public y: number = 0;
    public r: number = 20;
    public lineWidth: number = 1;
    public fillStyle: CanvasPattern; 

    constructor(x: number, y: number, r: number, fillStyle: CanvasPattern, lineWidth: number = 1)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.lineWidth = lineWidth;
        this.fillStyle = fillStyle;
    }

    draw(ctx:CanvasRenderingContext2D): void
    {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.fillStyle;
        ctx.fillStyle = this.fillStyle;
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
