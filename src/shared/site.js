export const SITE = {
    "name": "Anima",
    "home_heading": "ANIMA",
    "home_sub_heading" : "Old-timey Animation online",
    "failed_connection_message": `It looks like there has been an issue contacting the server.
        Try again in a few minutes, or contact support if this is a persistent problem.`,
    "failed_delete_message": `It looks like there has been an issue deleting the resource.
        Try again in a few minutes, or contact support if this is a persistent problem.`,
    "failed_update_message": `It looks like there has been an issue updating the resource.
        Try again in a few minutes, or contact support if this is a persistent problem.`,
    "failed_create_message": `It looks like there has been an issue creating the resource.
        Try again in a few minutes, or contact support if this is a persistent problem.`,
    "failed_retrieval_message": `It looks like there has been an issue retrieving the resource.
        Try again in a few minutes, or contact support if this is a persistent problem.`,
    "icons": {
        "drawingMode": process.env.REACT_APP_URL + '/assets/drawing-mode.svg',
        "single": process.env.REACT_APP_URL + '/assets/mode-single.svg',
        "mirror": process.env.REACT_APP_URL + '/assets/mode-mirror.svg',
        "lake": process.env.REACT_APP_URL + '/assets/mode-lake.svg',
        "quad": process.env.REACT_APP_URL + '/assets/mode-mandala.svg',
        "penSize": process.env.REACT_APP_URL + '/assets/pen-size.svg',
        "penColour": process.env.REACT_APP_URL + '/assets/pen-colour.svg',
        "undo": process.env.REACT_APP_URL + '/assets/undo.svg',
        "redo": process.env.REACT_APP_URL + '/assets/redo.svg',
        "frate": process.env.REACT_APP_URL + '/assets/frame-rate.svg',
        "wipe": process.env.REACT_APP_URL + '/assets/wipe-frame.svg',
        "bg": process.env.REACT_APP_URL + '/assets/bg.svg',
        "saveBg": process.env.REACT_APP_URL + '/assets/save-bg.svg',
        "drawBg": process.env.REACT_APP_URL + '/assets/draw-bg.svg',
        "bgOpacity": process.env.REACT_APP_URL + '/assets/bg-opacity.svg',
        "bgFrameOpacity": process.env.REACT_APP_URL + '/assets/bg-frame-opacity.svg',
        "next": process.env.REACT_APP_URL + '/assets/next-frame.svg',
        "download": process.env.REACT_APP_URL + '/assets/download.svg',
        "save": process.env.REACT_APP_URL + '/assets/save.svg',
        "preview": process.env.REACT_APP_URL + '/assets/preview.svg',
    },
    "shortcuts": [
        {"key": "s", "text":"Single point drawing mode"},
        {"key": "m", "text":"Horizontal double point drawing mode"},
        {"key": "l", "text":"Vertical double point drawing mode"},
        {"key": "q", "text":"Quadruple point drawing mode"},
        {"key": "1-7", "text":"Pen Size: 1 - 7"},
        {"key": "0", "text":"Pen colour: Background, solid"},
        {"key": "9", "text":"Pen colour: Background, shade"},
        {"key": "w", "text":"Pen colour: Foreground, solid"},
        {"key": "z", "text":"Pen colour: Foreground, shade"},
        {"key": "r", "text":"Pen colour: Red"},
        {"key": "g", "text":"Pen colour: Green"},
        {"key": "b", "text":"Pen colour: Blue"},
        {"key": "y", "text":"Pen colour: Yellow"},
        {"key": "o", "text":"Pen colour: Orange"},
        {"key": "c", "text":"Pen colour: Cyan"},
        {"key": "p", "text":"Pen colour: Purple"},
        {"key": "d", "text":"Pen colour: Pink"},
        {"key": "n / CTRL", "text":"Next frame"},
        {"key": "SHIFT", "text":"Draw background over current frame"},
        {"key": "x", "text":"Wipe current frame with blank background"},
        {"key": "[", "text":"Undo stroke"},
        {"key": "]", "text":"Redo stroke"},
    ]
}
