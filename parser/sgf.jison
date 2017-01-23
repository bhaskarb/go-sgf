
/* description: Parses and executes SGF(smart game format: http://www.red-bean.com/sgf/). */
%{
    function findLastNodeInSequence(node)
    {
        if(node.children.length == 0) {
            return node;
        }
        console.assert(node.children.length = 1);
        return findLastNodeInSequence(node.children[0]);
    };
%}

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
[A-Z]+                          return 'UCIDENT'
\[(\\.|[^\]])*\]              return 'PROP'
"("                             return '('
")"                             return ')'
";"                             return ';'
/lex

/* operator associations and precedence */


%start SGF 

%% /* language grammar */

SGF
    : GameTrees 
    {
        return $1;
    }
    ;

GameTrees
    : GameTree
        { $$ = [ $1 ]; 
            console.log("GAMETREE");
        }
    | GameTrees GameTree
        {
            $$=$1;
            console.log("GAMETREES GAMETREE");
            $1.push($2);
        }
    ;

GameTree
    : "(" Sequence ")"
        { $$ = $2; 
            console.log("SEQUENCE:")
            console.log(JSON.stringify($2))
            
        }
    | "(" Sequence GameTrees")"
        {
            lastNode = findLastNodeInSequence($2);
            lastNode["children"] = $3;
            console.log("SEQUENCE GAMETREE")
            $$ = $2;
            console.log(JSON.stringify($2))
        }
    ;

Sequence
    : Node
        { $$ = $1;
            console.log("NODE")
            console.log(JSON.stringify($1)); 
            $$ = $1;
        }
    | Sequence Node
        {
            console.log("SEQUENCE NODE")
            console.log(JSON.stringify($1)); 
            console.log(JSON.stringify($2)); 
            $1["children"].push($2);
            $$=$1;
        }
    ;

Node
    : ";"
        { 
            $$ = { "props": [], "children": [] }; 
        }
    | ";" Properties
        { 
            $$ = { "props": $2, "children": [] };
        }
    ;

Properties
    : Property
        { $$ = [ $1 ]; }
    | Properties Property
        {
            $$=$1;
            $1.push($2);
        }
    ;

Property
    : PropIdent PropValues
        {
            Object.assign($1, $2);
            $$ = $1;
        }
    ;

PropIdent
    : UCIDENT 
        { $$ = { "ucident": yytext}; }
    ;


PropValues
    : PropValue
        { $$ = { "props": [ $1 ] }; }
    | PropValues PropValue
        {
            $$=$1;
            $1["props"].push($2);
        }
    ;

PropValue
    : PROP 
        {
            $$ = yytext.slice(1, -1); 
        }
    ;

/* UCIDENT TEXT SIMPLETEXT COLOR DOUBLE  POINT MOVE STONE are all STRING */
/* NUMBER and REAL are both REAL */
