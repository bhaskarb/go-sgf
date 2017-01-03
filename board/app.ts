/// <reference path="Shape.ts"/>
/// <reference path="BoardView.ts"/>
/// <reference path="BoardState.ts"/>
/// <reference path="GameTree.ts"/>
var canvas:HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var gridSize: number = 19;
var grid: cGrid = new cGrid(0, 0, 720, 720, gridSize);
var move: number = 0;
var pattern: CanvasPattern;
var blkstone: CanvasPattern;
var whtstone: CanvasPattern;
var board :BoardState;
var gameTree: GameTree;
var gameLoopMode = false;


function drawStone(ctx, x, y, isWhite)
{
    var circle : cCircle;
    var r = grid.getStoneRadius();
    var point = grid.getStone(x, y);
    
    if(isWhite) {
        circle = new cCircle(point.x, point.y, r, whtstone);
    } else {
        circle = new cCircle(point.x, point.y, r, blkstone);
    }
    circle.draw(ctx);
}

function drawWholeBoard(ctx, pattern)
{
    var stone: number;
    
    grid.draw(ctx);
    for(var xRow =0; xRow < gridSize; xRow ++) {
        for(var xCol =0; xCol < gridSize; xCol ++) {
            stone = board.hasAtLoc(xRow, xCol); 
            if(stone != 0) {
                drawStone(ctx, xRow, xCol, stone == 2);
            }
        }
    }
}

function drawBoard(ctx, pattern, x, y, isClick)
{
    ctx.fillStyle = pattern;
    ctx.fill();
//    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 720, 720);

    var pointXY = grid.getStoneCanvasXY(x, y);
    var point = grid.getStone(pointXY.x, pointXY.y);

    drawWholeBoard(ctx, pattern);
    if(point.x != NaN && point.y != NaN && board.hasAtLoc(pointXY.x, pointXY.y) == 0) {
        drawStone(ctx, pointXY.x, pointXY.y, move%2 == 0)
        if(isClick) {
            board.add(pointXY.x, pointXY.y, (move % 2 == 0)?2:1);
            move ++;
        }
    }
}

function gameLoop() {
    
    if(gameTree != null) {
        setTimeout(function() {
            ctx.fillStyle = pattern;
            ctx.fill();
        //    ctx.fillStyle = "black";
            ctx.fillRect(0, 0, 720, 720);

            var data:string = gameTree.getData();
            var isWhite: boolean = data[0] == "W";
            var xRow: number = data.charCodeAt(2) - 'a'.charCodeAt(0);
            var xCol: number = data.charCodeAt(3) - 'a'.charCodeAt(0);
            
            board.add(xRow, xCol, isWhite?2:1);
            gameTree = gameTree.getFirstChild();
            drawWholeBoard(ctx, pattern);
        
            requestAnimationFrame(gameLoop);
        }, 1000);
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
        var moveStr = "B[pd];W[dp];B[qp];W[dc];B[oq];W[qf];B[pi];W[of];B[nc];W[rd];B[qc];W[ri];B[ce];W[cg]";
        var moves:Array<string> = moveStr.split(";");
        var xMove:number;
        var gameNode;

        gameTree = new GameTree(moves[0], null);
        gameNode = gameTree;
        for (xMove = 1; xMove < moves.length; xMove ++) {
            gameNode = new GameTree(moves[xMove], gameNode);
        }
        if(gameLoopMode) {
            gameLoop();
        } else {
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
}
