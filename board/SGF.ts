/// <reference path="GameTree.ts"/>

interface SGFProp {
    value: string;
    type: string;
    func: string;
}

class SGFProps {
    private _dict: any;

    constructor() {
        this._dict = {};
    } 
    addProp(name:string, value:string, type:string, func:string)
    {
        this._dict[name] = this.createProp(value, type, func); 
    }
    createProp(value:string, type:string, func:string):SGFProp {
        var prop:SGFProp;
        prop.value = value;
        prop.type = type;
        prop.func = func;
        return prop;
    }
    contains(name:string) {
        return name in this._dict;
    }
    getDefault()
    {
        this.addProp("B", "move", "move", "Execute a black move");
        this.addProp("W", "move", "move", "Execute a white move");
        this.addProp("KO", "none", "move", "Execute a given move even if illegal");
        this.addProp("MN", "number", "move", "Set the move number to a given value");
        
        this.addProp("AB", "point_list", "setup", "Add black stones");
        this.addProp("AE", "point_list", "setup", "Clear stones");
        this.addProp("AW", "point_list", "setup", "Add white stones");
        this.addProp("PL", "color", "setup", "set turn to play");
        
        this.addProp("C", "text", "", "Comment");
        this.addProp("DM", "double", "", "The position is even, dont mix with UC, GB, GW");
        this.addProp("GB", "double", "", "Good for black");
        this.addProp("GW", "double", "", "Good for white");
        this.addProp("HO", "double", "", "Hotspot");
        this.addProp("N", "simpletext", "", "Node name");
        this.addProp("UC", "double", "", "Unclear");
        this.addProp("V", "real", "", "Value for node");
        
        this.addProp("BM", "double", "move", "Bad Move");
        this.addProp("DO", "none", "move", "doubtful");
        this.addProp("IT", "none", "move", "interesting");
        this.addProp("TE", "double", "move", "tesuji");
        
        this.addProp("AR", "point_list", "", "Arrow");
        this.addProp("CR", "point_list", "", "Circle");
        this.addProp("DD", "point_list", "", "Dim, empty clears");
        this.addProp("VW", "point_list", "", "Write text");
        this.addProp("LN", "point_list", "", "Line");
        this.addProp("MA", "point_list", "", "Mark X");
        this.addProp("SL", "point_list", "", "Select point");
        this.addProp("SQ", "point_list", "", "Square");
        this.addProp("TR", "point_list", "", "Triangle");
        
        this.addProp("AP", "composed", "root", "name and version");
        this.addProp("CA", "simpletext", "root", "charset");
        this.addProp("FF", "number", "root", "file format");
        this.addProp("GM", "number", "root", "game type");
        this.addProp("ST", "number", "root", "variation style");
        this.addProp("SZ", "number", "root", "size");
        
        this.addProp("AN", "simpletext", "game-info", "name of the person");
        this.addProp("BR", "simpletext", "game-info", "Rank of black");
        this.addProp("BT", "simpletext", "game-info", "Black team name");
        this.addProp("CP", "simpletext", "game-info", "Copyright");
        this.addProp("DT", "simpletext", "game-info", "Date");
        this.addProp("EV", "simpletext", "game-info", "Event name");
        this.addProp("GN", "simpletext", "game-info", "Game name");
        this.addProp("GC", "text", "game-info", "Game info");
        this.addProp("ON", "simpletext", "game-info", "Opening");
        this.addProp("OT", "simpletext", "game-info", "Overtime");
        this.addProp("PB", "simpletext", "game-info", "Black player name");
        this.addProp("PW", "simpletext", "game-info", "White player name");
        this.addProp("RE", "simpletext", "game-info", "Game result");
        this.addProp("RO", "simpletext", "game-info", "Round number number and type [xx (tt)]");
        this.addProp("RU", "simpletext", "game-info", "Rule used");
        this.addProp("SO", "simpletext", "game-info", "Source");
        this.addProp("TM", "simpletext", "game-info", "Time limit");
        this.addProp("US", "simpletext", "game-info", "User Name");
        this.addProp("WR", "simpletext", "game-info", "White Rank");
        this.addProp("WT", "simpletext", "game-info", "White Team");
        
        this.addProp("BL", "real", "move", "Black Time left");
        this.addProp("OB", "number", "move", "Black moves left");
        this.addProp("OW", "number", "move", "White moves left");
        this.addProp("WL", "real", "move", "White Time left");

        this.addProp("FG", "", "", "Figure");
        this.addProp("PM", "number", "inherit", "Printing");
        this.addProp("VW", "point_list", "inherit", "View part of board");

        //Go Specific
        this.addProp("HA", "number", "game-info", "Handicap");
        this.addProp("KM", "real", "game-info", "Komi");
        this.addProp("TB", "poing_list", "", "Black territory");
        this.addProp("TW", "poing_list", "", "White territory");


    }
    GetProp(name:string):SGFProp {
        return this._dict[name];
    }
}


function evaluateCompose(val:string): Array<string> {
    console.assert(val.indexOf(":") != -1);
    return val.split(":");
}

function getFirstProp(node:any):string
{
    var propvalues = node["propvalues"];
    var firstProp = propvalues[0];
    if("string" in firstProp){
        return firstProp["string"]
    } 
    return String(firstProp["number"]);
}

function evaluateNode(node:any, gtree:GameTree, sgfprop:SGFProps): GameTree
{
    var ucident = node["ucident"];
    var firstProp = getFirstProp(node);

    if (!sgfprop.contains(ucident)) {
        console.error("Invalid SGF prop " + ucident);
    }
    var sgfp:SGFProp =  sgfprop.GetProp(ucident);
    if(sgfp.type == "move") {
        var child:GameTree = new GameTree(firstProp, gtree);
        return child;
    }
    return gtree;
}

function convertSGFToGameTree(sgfjson:any, parent:GameTree, sgfprop:SGFProps) {
    var gametrees = sgfjson["gametrees"];
    var currTree = parent;
    for(var i = 0; i < gametrees.length; i ++) {
        var gametree = gametrees[i];
        var sequence = gametree["sequence"];
        for(var i = 0; i < sequence.length; i ++) {
            var node = sequence[i];
            currTree = evaluateNode(node, currTree, sgfprop);
        }
        convertSGFToGameTree(gametree["gametree"], currTree, sgfprop);
    }
}
