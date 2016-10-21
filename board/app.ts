/// <reference path="draw.ts"/>
var canvas:HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var gridSize: number = 19;
var grid: cGrid = new cGrid(0, 0, 720, 720, gridSize);
var circles: Array<cCircle>;
var move: number = 0;

function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1280, 720);

    var x = Math.floor(Math.random()*(gridSize + 1));
    var y = Math.floor(Math.random()*(gridSize+ 1));
    var r = grid.getStoneRadius();
    var point = grid.getStone(x, y);
    var circle = new cCircle(point.x, point.y, r);
    if(move % 2 == 0) {
        circle.color = "white";
    } else {
        circle.color = "black";
    }
    move ++;
    circles.push(circle);
    grid.draw(ctx);
    for(var i = 0; i < circles.length; i ++) {
        circles[i].draw(ctx);
    }
} 


window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    ctx = canvas.getContext("2d");
    circles = [];
    gameLoop();
}
