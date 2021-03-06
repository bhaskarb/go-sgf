/// <reference path="Shapes.ts"/>
/// <reference path="BoardView.ts"/>
/// <reference path="GameTree.ts"/>
var canvas:HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var gridSize: number = 19;
var move: number = 0;
var pattern: CanvasPattern;
var blkstone: CanvasPattern;
var whtstone: CanvasPattern;
var boardview :BoardView;
var gameTree: GameTree;
var gameLoopMode = false;


function drawStone(ctx, x, y, isWhite)
{
    var circle : cCircle;
    var r = boardview.getStoneRadius();
    var point = boardview.getStone(x, y);
    
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
    
    boardview.draw(ctx);
    for(var xRow =0; xRow < gridSize; xRow ++) {
        for(var xCol =0; xCol < gridSize; xCol ++) {
            stone = boardview.board.hasAtLoc(xRow, xCol); 
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

    var pointXY = boardview.getStoneCanvasXY(x, y);
    var point = boardview.getStone(pointXY.x, pointXY.y);

    drawWholeBoard(ctx, pattern);
    if(point.x != NaN && point.y != NaN && boardview.board.hasAtLoc(pointXY.x, pointXY.y) == 0) {
        drawStone(ctx, pointXY.x, pointXY.y, move%2 == 0)
        if(isClick) {
            boardview.board.add(pointXY.x, pointXY.y, (move % 2 == 0)?2:1);
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

            var dict:IDict = gameTree.getData();
            var data:string = dict["data"];
            var isWhite: boolean = data[0] == "W";
            var xRow: number = data.charCodeAt(2) - 'a'.charCodeAt(0);
            var xCol: number = data.charCodeAt(3) - 'a'.charCodeAt(0);
            
            boardview.board.add(xRow, xCol, isWhite?2:1);
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
    
    boardview = new BoardView(0, 0, 720, 720, gridSize);
    boardview.buildLayers();

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
