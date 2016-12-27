class BoardState {
    public _state: Array<number>;
    public numRows: number;
    public numCols: number;

    constructor (numRows: number, numCols: number) {
        this.numCols = numCols;
        this.numRows = numRows;
        var len = numCols*numRows;
        this._state = new Array<number>(numCols*numRows);
        
        for(var x = 0; x < len ; x ++) {
            this._state[x] = 0;
        }
    }

    logState(): void {
        console.log(this._state);
    }

    hasAtLoc(xRow:number, xCol:number):number {
        console.assert(xRow >= 0);
        console.assert(xRow < this.numRows);
        console.assert(xCol >= 0);
        console.assert(xCol < this.numCols);
        return this._state[xRow*this.numCols + xCol];
    }

    add(xRow: number, xCol: number, objId:number) {
        this._state[xRow*this.numCols + xCol] = objId;
        console.log("Moved " + objId + " to " + "(" + xRow + "," + xCol + ")")
    }
    
    del(xRow: number, xCol: number) {
        this._state[xRow*this.numCols + xCol] = 0;
    }
}
