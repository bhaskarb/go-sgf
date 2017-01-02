class GameTree {
    private _parent: GameTree;
    private _children: Array<GameTree>;
    private _data: string;

    constructor (data:string, parent=null) {
        this._data = data;
        this._parent = parent;
        this._children = [];
        if(this._parent != null) {
            this._parent.addChild(this);
        }
    }

    getData(): string {
        return this._data;
    }

    addChild(child:GameTree):void {
        this._children.push(child);
    }
    doDFS(func:(value:string) => void):void {
        var child: GameTree;
        var xChild : number = 0;
        var numChild :number = this._children.length;

        func(this._data);
        for(; xChild < numChild; xChild ++) {
            child = this._children[xChild];
            child.doDFS(func);
        }
    }
    getFirstChild(): GameTree {
        if(this._children.length == 0) {
            return null;
        }
        return this._children[0];
    }
}
