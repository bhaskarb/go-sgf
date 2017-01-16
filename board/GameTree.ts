interface IDict {
    [key:string] : string;
}

class GameTree {
    private _parent: GameTree;
    private _children: Array<GameTree>;
    private _dict: IDict; 

    constructor (data:string, parent=null) {
        this._dict["data"] = data;
        this._parent = parent;
        this._children = [];
        if(this._parent != null) {
            this._parent.addChild(this);
        }
    }

    addItem(key:string, value:string) {
        console.assert(!(key in this._dict));
        this._dict[key] = value;
    }

    getData(): IDict {
        return this._dict;
    }

    addChild(child:GameTree):void {
        this._children.push(child);
    }
    doDFS(func:(value:IDict) => void):void {
        var child: GameTree;
        var xChild : number = 0;
        var numChild :number = this._children.length;

        func(this._dict);
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
