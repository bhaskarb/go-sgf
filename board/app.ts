/// <reference path="draw.ts"/>
/// <reference path="Board.ts"/>
var canvas:HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var gridSize: number = 19;
var grid: cGrid = new cGrid(0, 0, 720, 720, gridSize);
var circles: Array<cCircle>;
var move: number = 0;
var pattern: CanvasPattern;
var blkstone: CanvasPattern;
var whtstone: CanvasPattern;
var board :BoardState;

function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = pattern;
    ctx.fill();
//    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 720, 720);

    var x = Math.floor(Math.random()*(gridSize));
    var y = Math.floor(Math.random()*(gridSize));
    var r = grid.getStoneRadius();
    var point = grid.getStone(x, y);
    var circle : cCircle;

    if(board.hasAtLoc(x, y) == 0) {
        board.add(x, y, (move % 2)?2:1);
        if(move % 2 === 0) {
            circle = new cCircle(point.x, point.y, r, whtstone);
        } else {
            circle = new cCircle(point.x, point.y, r, blkstone);
        }
        move ++;
        circles.push(circle);
    }
    grid.draw(ctx);
    for(var i = 0; i < circles.length; i ++) {
        circles[i].draw(ctx);
    }
} 


window.onload = () => {
    var goboardimg = new Image();
    var blkstoneimg = new Image();
    var whtstoneimg = new Image();
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    ctx = canvas.getContext("2d");
    circles = [];
    board = new BoardState(gridSize, gridSize);
    
    whtstoneimg.src = 'white.png';
    whtstoneimg.onload = function () {
        whtstone = ctx.createPattern(this, "repeat");
    }
    
    blkstoneimg.src = 'black.png';
    blkstoneimg.onload = function () {
        blkstone = ctx.createPattern(this, "repeat");
    }
    
    goboardimg.src = 'wood-texture.jpg';
    goboardimg.onload = function() {
        pattern = ctx.createPattern(this, "repeat");
        gameLoop();
    }
}
