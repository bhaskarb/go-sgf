
/* description: Parses and executes SGF(smart game format: http://www.red-bean.com/sgf/). */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
[0-9]+"."[0-9]+         return 'REAL'
"["                     return '['
"]"                     return ']'
"("                     return '('
")"                     return ')'
":"                     return ':'
";"                     return ';'
(\\.|[^"\[\]:\(\)])+        return 'STRING'
/lex

/* operator associations and precedence */

%start SGF 

%% /* language grammar */

SGF
    : Collection
    {
        return $1;
    }
    ;

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
        { $$ = $2; }
    | "(" Sequence Collection ")"
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
        { $$ = { "node" : "null"}; }
    | ";" Properties
        { 
            $$ = { "node" : $2 }; 
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
    : STRING 
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
    : "[" CValueType "]"
        { 
            $$ = $2; 
        }
    ;

CValueType
    : ValueType
        { 
            $$ =  $1 ; 
        }
    | ValueType ":" ValueType
        { 
            $$ = { 
                 "compose1" : $1,
                 "compose2": $3
                };
        }
    ;

ValueType
    : REAL
        { 
            $$ = { "number": Number(yytext)}; 
        }
    | STRING 
        {
            $$ = { "data": yytext}; 
        }
    ;

/* UCIDENT TEXT SIMPLETEXT COLOR DOUBLE  POINT MOVE STONE are all STRING */
/* NUMBER and REAL are both REAL */
