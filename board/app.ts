/// <reference path="draw.ts"/>
/// <reference path="BoardState.ts"/>
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
    var x = Math.floor(Math.random()*(gridSize));
    var y = Math.floor(Math.random()*(gridSize));
} 

function drawBoard(ctx, pattern, x, y, isClick)
{
    ctx.fillStyle = pattern;
    ctx.fill();
//    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 720, 720);

    var r = grid.getStoneRadius();
    var pointXY = grid.getStoneCanvasXY(x, y);
    var point = grid.getStone(pointXY.x, pointXY.y);
    var circle : cCircle;

    if(point.x != NaN && point.y != NaN) {
        if(move % 2 === 0) {
            circle = new cCircle(point.x, point.y, r, whtstone);
        } else {
            circle = new cCircle(point.x, point.y, r, blkstone);
        }
        grid.draw(ctx);
        if(!isClick) {
            circle.draw(ctx);
        } else if(board.hasAtLoc(pointXY.x, pointXY.y) == 0) {
            board.add(pointXY.x, pointXY.y, (move % 2)?2:1);
            move ++;
            circles.push(circle);
        }
        for(var i = 0; i < circles.length; i ++) {
            circles[i].draw(ctx);
        }
    }
}

function getMousePos(canvas:HTMLCanvasElement, evnt)
{
    var rect = canvas.getBoundingClientRect();
    return {
        x: evnt.clientX - rect.left,
        y: evnt.clientY - rect.top
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
//        gameLoop();
        canvas.addEventListener('mousemove', function(evnt){
            var mousePos = getMousePos(canvas, evnt);
            drawBoard(ctx, pattern, mousePos.x, mousePos.y, false);
        }, false);
        canvas.addEventListener('click', function(evnt){
            var mousePos = getMousePos(canvas, evnt);
            drawBoard(ctx, pattern, mousePos.x, mousePos.y, true);
            console.log('Mouse position: ' + mousePos.x + ', ' + mousePos.y)
        }, false);
    }
}
