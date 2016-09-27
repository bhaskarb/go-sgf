
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
