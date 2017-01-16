
/* description: Parses and executes SGF(smart game format: http://www.red-bean.com/sgf/). */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
[A-Z]+                          return 'UCIDENT'
\[[+-]*[0-9]+\]                 return 'NUMBER'
\[[+-]*[0-9]+"."[0-9]+\]        return 'REAL'
\[(\\.|[^\]])*\]              return 'STRING'
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
        { $$ = { "gametrees": [ $1 ] }; }
    | GameTrees GameTree
        {
            $$=$1;
            $1["gametrees"].push($2);
        }
    ;

GameTree
    : "(" Sequence ")"
        { $$ = $2; }
    | "(" Sequence GameTrees ")"
        {
            $$ = $2;
            $2["gametree"] = $3;
        }
    ;

Sequence
    : Node
        { $$ = { "sequence": [ $1 ] }; }
    | Sequence Node
        {
            $$=$1;
            $1["sequence"].push($2);
        }
    ;

Node
    : ";"
        { $$ = { }; }
    | ";" Properties
        { 
            $$ = $2; 
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
        { $$ = { "propvalues": [ $1 ] }; }
    | PropValues PropValue
        {
            $$=$1;
            $1["propvalues"].push($2);
        }
    ;

PropValue
    : REAL
        { 
            $$ = { "number": Number(yytext.slice(1,-1))}; 
        }
    | STRING 
        {
            $$ = { "string": yytext.slice(1, -1)}; 
        }
    | NUMBER 
        { 
            $$ = { "number": Number(yytext.slice(1,-1))}; 
        }
    ;

/* UCIDENT TEXT SIMPLETEXT COLOR DOUBLE  POINT MOVE STONE are all STRING */
/* NUMBER and REAL are both REAL */
