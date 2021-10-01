import { values } from './values';
import { CC } from './controls';
import { saveAs } from 'file-saver';


export const downloadAnimAsGif = (a, p5canvas, p5) => {
    renderAnim(a, 'DOWNLOAD', p5canvas, p5);
}

export const drawFrame = (f, p5) => {
    setBgOverlay(p5);
    drawPoints(f.bg, p5);
    drawPoints(f.points, p5);
}

export const drawPoints = (points, p5) => {
        points.forEach((element) => {
            drawStroke(element, p5);
        });
}

export const drawPoint = (p, p5) => {
    p5.fill(p.pc[0], p.pc[1], p.pc[2], p.pc[3]);
    switch(p.m)
    {
        case CC.SINGLE:
            p5.ellipse(p.x, p.y, p.ps, p.ps);
            break;
        case CC.MIRROR:
            p5.ellipse(p.x, p.y, p.ps, p.ps);
			p5.ellipse(p5.width - p.x, p.y, p.ps, p.ps);
            break;
        case CC.LAKE:
            p5.ellipse(p.x, p.y, p.ps, p.ps);
			p5.ellipse(p.x, p5.height - p.y, p.ps, p.ps);
            break;
        case CC.QUAD:
            p5.ellipse(p.x, p.y, p.ps, p.ps);
			p5.ellipse(p.x, p5.height - p.y, p.ps, p.ps);
			p5.ellipse(p5.width - p.x, p5.height - p.y, p.ps, p.ps);
			p5.ellipse(p5.width - p.x, p.y, p.ps, p.ps);
            break;
            default:
                console.warn('drawing mode has been set to a an invalid value');
                return false;        
    }
    return true;
}

export const drawStroke = (stroke, p5) => {
    stroke.forEach((element) => {
        drawPoint(element, p5);
    });
}

export const playPreview = (blob, name) => {
    //todo
}

export const previewAnim = async (a, p5canvas, p5) => {
    renderAnim(a, 'PREVIEW', p5canvas, p5);
}

export const renderAnim = (a, type, p5canvas, p5) =>{
    const CCapture = window.CCapture; 
    let capturer = new CCapture({format: 'gif',
        workersPath: process.env.PUBLIC_URL + '/ccapture/',
        framerate: a.frate
    });
    capturer.start();
    setBgOverlay(p5);
    setBgOverlay(p5);
    a.frames.forEach((f) => {
       setFrameCaptured(f, capturer, p5canvas, p5);
    });
    capturer.stop();
    capturer.save((blob) => {
        if(type === 'PREVIEW'){
            playPreview(blob, a.name);
        }else if(type === 'DOWNLOAD'){
            saveAs(blob, a.name);
        }
    });
}

export const setBgOverlay = (p5) => {
        p5.background(values.bgc);
}

export const setFrameCaptured = async (f, capturer, p5canvas, p5) => {
    drawFrame(f, p5);
    let img = p5.get(0, 0, 600, 600);
    img.loadPixels();
    p5.image(img, 0, 0);
    capturer.capture(p5canvas.elt)
}
