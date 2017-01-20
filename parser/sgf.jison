
/* description: Parses and executes SGF(smart game format: http://www.red-bean.com/sgf/). */

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
        { $$ = [ $1 ]; }
    | GameTrees GameTree
        {
            $$=$1;
            $1.push($2);
        }
    ;

GameTree
    : "(" Sequence ")"
        { $$ = $2; }
    ;

Sequence
    : Node
        { $$ = $1;
        }
    | Node GameTrees
    {
        $1["children"] = $2;
        $$ = $1
    }
    | Sequence Node
        {
            $1["children"].push($2);
            $$=$1;
        }
    | Sequence Node GameTrees
        {
            $1["children"].push($2);
            $$=$1;
            $2["children"] = $3;
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
