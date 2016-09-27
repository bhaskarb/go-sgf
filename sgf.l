
%{
%}


[A-Z]+  { return UCIDENT; }
[0-9]+  { return NUMBER; }
[0-9]+\.[0-9]+  { return REAL; }
[1|2]   { return DOUBLE;}
[B|W]   { return COLOR;}
[a-zA-z0-9]

[a-zA-Z][a-zA-Z]
