
/* description: Parses and executes SGF(smart game format: http://www.red-bean.com/sgf/). */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
[0-9]+"."[0-9]+         return 'REAL'
[0-9]+                  return 'NUMBER'
[1|2]                   return 'DOUBLE'
[B|W]                   return 'COLOR'
[A-Z]+                  return 'UCIDENT'
(\\.|[^"])+             return 'STRING'
<<EOF>>                 return 'EOF'

/lex

/* operator associations and precedence */

%start Collection 

%% /* language grammar */


Collection: GameTree
| Collection GameTree

GameTree: "(" Sequence ")"
| "(" Sequence Collection ")"

Sequence: Node
| Sequence Node

Node: ";"
| ";" Properties

Properties: Property
| Properties Property

Property: PropIdent PropValues

PropValues: PropValue
| PropValues PropValue

PropValue: "[" CValueType "]"

CValueType: ValueType
| ValueType ":" ValueType

PropIdent: UCIDENT

ValueType: NONE
| NUMBER
| REAL
| DOUBLE
| COLOR
| TEXT
| SIMPLETEXT
| POINT
| MOVE
| STONE
