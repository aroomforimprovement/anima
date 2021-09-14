export const CC = 
{
    SINGLE: 101, MIRROR: 102, LAKE: 103, QUAD: 104,
    TYPE_MODE: 201, TYPE_TRIGGER: 202, TYPE_COLOUR: 203, TYPE_SIZE: 204,
    GREEN: 301, BLUE: 302, YELLOW: 303, ORANGE: 304, CYAN: 305, PURLPLE: 306, PINK: 307,
    BG_SOLID: 308, BG_SHADE: 309, FG_SOLID: 310, FG_SHADE: 311,
    PS_1: 2, PS_2: 6, PS_3: 12, PS_4: 24, PS_5: 36, PS_6: 48, PS_7: 60, 
};

export const CONTROLS = 
[
    {k: 's', v: CC.SINGLE, n: "SINGLE", t: CC.TYPE_MODE},
    {k: 'm', v: CC.MIRROR, n: "MIRROR", t: CC.TYPE_MODE},
    {k: 'l', v: CC.LAKE, n: "LAKE", t: CC.TYPE_MODE},
    {k: 'q', v: CC.QUAD, n: "QUAD", t: CC.TYPE_MODE},
    {k : '0', v : CC.BG_SOLID, n : "BG_SOLID", t : CC.TYPE_COLOUR},
	{k : '9', v : CC.BG_SHADE, n : "BG_SHADE", t : CC.TYPE_COLOUR},
	{k : 'w', v : CC.FG_SOLID, n : "FG_SOLID", t : CC.TYPE_COLOUR},
	{k : 'z', v : CC.FG_SHADE, n : "FG_SHADE", t : CC.TYPE_COLOUR},
    {k : 'r', v : CC.RED, n : "RED", arr : [185, 70, 70, 200], t : CC.TYPE_COLOUR},
	{k : 'g', v : CC.GREEN, n : "GREEN", arr : [70, 185, 70, 200], t : CC.TYPE_COLOUR},
	{k : 'b', v : CC.BLUE, n : "BLUE", arr : [120, 210, 230, 200], t : CC.TYPE_COLOUR},
	{k : 'y', v : CC.YELLOW, n : "YELLOW", arr : [255, 255, 100, 200], t : CC.TYPE_COLOUR},
	{k : 'o', v : CC.ORANGE, n : "ORANGE", arr : [242, 149, 0, 200], t : CC.TYPE_COLOUR},
	{k : 'j', v : CC.CYAN, n : "CYAN", arr : [0, 238, 242, 200], t : CC.TYPE_COLOUR},
	{k : 'p', v : CC.PURPLE, n : "PURPLE", arr : [127, 0, 181, 200], t : CC.TYPE_COLOUR},
	{k : 'd', v : CC.PINK, n : "PINK", arr : [242, 92, 162, 200], t : CC.TYPE_COLOUR},
    {k : '1', v : CC.PS_1, size : 2, n : "PS_1", t : CC.TYPE_SIZE},
	{k : '2', v : CC.PS_2, size : 4, n : "PS_2", t : CC.TYPE_SIZE},
	{k : '3', v : CC.PS_3, size : 6, n : "PS_3", t : CC.TYPE_SIZE},
	{k : '4', v : CC.PS_4, size : 10, n : "PS_4", t : CC.TYPE_SIZE},
	{k : '5', v : CC.PS_5, size : 16, n : "PS_5", t : CC.TYPE_SIZE},
	{k : '6', v : CC.PS_6, size : 24, n : "PS_6", t : CC.TYPE_SIZE},
	{k : '7', v : CC.PS_7, size : 36, n : "PS_7", t : CC.TYPE_SIZE},
];


