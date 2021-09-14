import { CC }  from './controls';

export const values = {
    initialBgc: [20, 20, 20, 255],
    bgc: [20, 20, 20, 200],
    penWhite: [200, 200, 200, 200],
    initialControlState: {
        mode: CC.SINGLE,
        pc: [200, 200, 200, 200],
        ps: CC.PS_2,
        enabled: true,
        undo: false,
        redo: false
    },
    initialAnimState: {
        anim:{
            "animid": null,
            "userid": null,
            "name": null,
            "type": "animation",
            "created": null,
            "modified": null,
            "frate": 8,
            "size": 0,
            "privacy": 0,
            "frames": [],
        },
        undos:[],
        redos:[],
        undid:[],
        redid:[],
        lastFrame:[],
        bgFrame:[],
    },
    red:  [185, 70, 70, 200],
    green: [70, 185, 70, 200],
    blue: [120, 210, 230, 200],
    yellow: [255, 255, 100, 200],
    orange: [242, 149, 0, 200],
    cyan: [0, 238, 242, 200],
    purple: [127, 0, 181, 200],
    pink: [242, 92, 162, 200],
    bg_solid:  [20, 20, 20, 200],
    bg_shade: [20, 20, 20, 50],
    fg_solid: [220, 220, 220, 200],
    fg_shade: [220, 220, 220, 50],
}