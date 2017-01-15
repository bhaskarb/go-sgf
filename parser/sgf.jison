
/* description: Parses and executes SGF(smart game format: http://www.red-bean.com/sgf/). */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
[0-9]+"."[0-9]+         return 'REAL'
(\\.|[^"\[\]:\(\)])+        return 'STRING'
"["                     return '['
"]"                     return ']'
"("                     return '('
")"                     return ')'
":"                     return ':'
/lex

/* operator associations and precedence */

%start Collection 

%% /* language grammar */

Collection
    : GameTree
        { $$ = { "gametrees": [ $1 ] }; }
    | Collection GameTree
        {
            $$=$1;
            $1["gametrees"].push($2);
        }
    ;

GameTree
    : "(" Sequence ")"
        { $$ = $1; }
    | "(" Sequence Collection ")"
        {
            Object.assign($1, $2);
            $$ = $1;
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
        { $$ = { "node" : "null"}; }
    | ";" Properties
        { $$ = { "node" : $2 }; }
    ;

Properties
    : Property
        { $$ = { "property": [ $1 ] }; }
    | Properties Property
        {
            $$=$1;
            $1["property"].push($2);
        }
    ;

Property
    : PropIdent PropValues
        {
            Object.assign($1, $2);
            $$ = $1;
        }
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
    : "[" CValueType "]"
        { $$ = $1; }
    ;

CValueType
    : ValueType
        { $$ =  $1 ; }
    | ValueType ":" ValueType
        { $$ = { 
                 "compose1" : $1,
                 "compose2": $3
                };
        }
    ;

PropIdent
    : TEXT 
        { $$ = { "ucident": yytext}; }
    ;

ValueType
    | REAL
        { $$ = { "number": Number(yytext)}; }
    | TEXT
        { $$ = { "data": yytext}; }
    ;

/* UCIDENT TEXT SIMPLETEXT COLOR DOUBLE  POINT MOVE STONE are all TEXTs */
/* NUMBER and REAL are both numbers*/
