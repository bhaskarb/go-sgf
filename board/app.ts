/// <reference path="draw.ts"/>
var canvas:HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var gridSize: number = 19;
var grid: cGrid = new cGrid(0, 0, 720, 720, gridSize);
var circles: Array<cCircle>;
var move: number = 0;
var pattern: CanvasPattern;
var blkstone: CanvasPattern;
var whtstone: CanvasPattern;

function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = pattern;
    ctx.fill();
//    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 720, 720);

    var x = Math.floor(Math.random()*(gridSize + 1));
    var y = Math.floor(Math.random()*(gridSize+ 1));
    var r = grid.getStoneRadius();
    var point = grid.getStone(x, y);
    var circle = new cCircle(point.x, point.y, r);
    if(move % 2 === 0) {
        circle.fillStyle = whtstone;
    } else {
        circle.fillStyle = blkstone;
    }
    move ++;
    circles.push(circle);
    grid.draw(ctx);
    for(var i = 0; i < circles.length; i ++) {
        circles[i].draw(ctx);
    }
} 


window.onload = () => {
    var goboardimg = new Image();
    var blackstoneimg = new Image();
    var whitestoneimg = new Image();
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    ctx = canvas.getContext("2d");
    circles = [];
    
    blackstoneimg.src = 'black.png';
    blackstoneimg.onload = function () {
        blkstone = ctx.circle
    }
    
    goboardimg.src = 'wood-texture.jpg';
    goboardimg.onload = function() {
        pattern = ctx.createPattern(this, "repeat");
        gameLoop();
    }
}
