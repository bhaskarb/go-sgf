/// <reference path="BoardState.ts"/>
/// <reference path="Shapes.ts"/>

interface iLayer {
    draw(ctx:CanvasRenderingContext2D): void;
    x: number;
    y: number;
    w:number;
    h:number;
    n:number;
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
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.lineWidth = 1;
        for(var i = 1; i < this.n ; i++) {
            ctx.moveTo(this.x + xUnit, this.y + i*yUnit);
            ctx.lineTo(this.x + this.w - xUnit, this.y + i*yUnit);
            ctx.moveTo(this.x + i*xUnit, this.y + yUnit);
            ctx.lineTo(this.x + i*yUnit, this.y + this.h - yUnit);
        }
        ctx.stroke();
        ctx.restore();
    }
}

class cStarPoints implements iLayer {
    public x: number = 0;
    public y: number = 0;
    public w:number = 1280;
    public h:number = 720;
    public n:number = 19;
    private _starlocX: Array<number>;
    private _starlocY: Array<number>;

    constructor(x:number, y:number, w:number, h:number, n:number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.n = n + 1;
        if (n == 19) {
            this._starlocX = [3, 3, 3,9, 9, 9, 15, 15, 15];
            this._starlocY = [3, 9, 15, 3, 9, 15, 3, 9, 15];
        }
    }
    draw(ctx:CanvasRenderingContext2D): void
    {
        var xUnit:number = this.h/this.n;
        var yUnit:number = this.w/this.n;
        ctx.save();
        ctx.beginPath();
        for(var i = 0; i < this._starlocX.length ; i++) {
            var xRow = this._starlocX[i];
            var xCol = this._starlocY[i];
            var circle = new cCircle(this.x + xRow*xUnit + xUnit, this.y + xCol*yUnit + yUnit, 2, "black");
            circle.draw(ctx);
        }
        ctx.stroke();
        ctx.restore();
    }
}

class BoardView {
    private _layers: Array<iLayer>;
    private _description: string;
    private xUnit:number;
    private yUnit:number;
    public board: BoardState;
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
        this.n = n;
        this.yUnit = this.h/(this.n + 1);
        this.xUnit = this.w/(this.n + 1);
        this._layers = [];
        this.board = new BoardState(this.n, this.n);
    }
    buildLayers() {
        this._layers.push(new cGrid(this.x, this.y, this.w, this.h, this.n))
        this._layers.push(new cStarPoints(this.x, this.y, this.w, this.h, this.n))
    }
    draw(ctx:CanvasRenderingContext2D): void {
        var xLayer: number;
        for(xLayer = 0; xLayer < this._layers.length; xLayer ++) {
            this._layers[xLayer].draw(ctx);
        }
    }

    getStoneCanvasXY(xC:number, yC:number):cPoint
    {
        var x: number = Math.max(0, Math.min(this.n - 1, Math.floor((xC/this.xUnit) - 0.5)));
        var y: number = Math.max(0, Math.min(this.n - 1, Math.floor((yC/this.yUnit) - 0.5)));
        return new cPoint(x, y);
    }
    getStone(x:number, y:number):cPoint
    {
        if(x < 0 || x > this.n - 1) {
            return new cPoint(NaN, NaN);
        }
        if(y < 0 || y > this.n - 1) {
            return new cPoint(NaN, NaN);
        }
        return new cPoint(this.x + (x + 1)*this.xUnit, this.y + (y + 1)*this.yUnit); 
    }
    getStoneRadius():number
    {
        return (Math.min(this.w,this.h)/(2*this.n)) - 1;
    }
}
