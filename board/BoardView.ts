/// <reference path="BoardState.ts"/>
/// <reference path="Shape.ts"/>

interface iLayer {
    draw(ctx:CanvasRenderingContext2D): void;
}

class cGrid implements iLayer {
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
        this.n = n + 1;
    }
    draw(ctx:CanvasRenderingContext2D): void
    {
        var xUnit:number = this.h/this.n;
        var yUnit:number = this.w/this.n;
        ctx.save();
        ctx.beginPath();
//        ctx.fillStyle = "firebrick";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.lineWidth = 2;
        for(var i = 1; i < this.n ; i++) {
            ctx.moveTo(this.x + xUnit, this.y + i*yUnit);
            ctx.lineTo(this.x + this.w - xUnit, this.y + i*yUnit);
            ctx.moveTo(this.x + i*xUnit, this.y + yUnit);
            ctx.lineTo(this.x + i*yUnit, this.y + this.h - yUnit);
        }
        ctx.stroke();
        ctx.restore();
    }
    getStoneCanvasXY(xC:number, yC:number):cPoint
    {
        var yUnit:number = this.h/this.n;
        var xUnit:number = this.w/this.n;
        var x: number = Math.max(0, Math.min(this.n - 2, Math.floor((xC/xUnit) - 0.5)));
        var y: number = Math.max(0, Math.min(this.n - 2, Math.floor((yC/yUnit) - 0.5)));
        return new cPoint(x, y);
    }
    getStone(x:number, y:number):cPoint
    {
        var xUnit:number = this.h/this.n;
        var yUnit:number = this.w/this.n;
        if(x < 0 || x >= this.n - 1) {
            return new cPoint(NaN, NaN);
        }
        if(y < 0 || y >= this.n - 1) {
            return new cPoint(NaN, NaN);
        }
        return new cPoint(this.x + (x + 1)*xUnit, this.y + (y + 1)*yUnit); 
    }
    getStoneRadius():number
    {
        return (Math.min(this.w,this.h)/(2*this.n)) - 1;
    }
}
class BoardView {
    private _state: BoardState;
    private _layers: Array<iLayer>;
    private _description: string;

    constrcutor
}
