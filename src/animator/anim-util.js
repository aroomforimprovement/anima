import { values } from './values';
import { CC } from './controls';
import { saveAs } from 'file-saver';


export const downloadAnimAsWebm = (a, p5canvas, p5) => {
    try{
        renderAnim(a, 'DOWNLOAD', p5canvas, p5);
    }catch(err){
        console.error(err);
    }
}

export const drawFrame = (f, p5, render) => {
    setBgOverlay(p5, render);
    //console.log("drawFrame:");
    //console.dir(f);
    if(f.bg && f.bg.length > 0){
        //console.log('drawing background');
        drawPoints(f.bg, p5, render);   
    }
    drawPoints(f.points, p5, render);
}

export const drawPoints = (points, p5, render) => {
        points.forEach((element) => {
            drawStroke(element, p5, render);
        });
}

export const drawPoint = (p, p5, render) => {
    p5.fill(p.pc[0], p.pc[1], p.pc[2], p.pc[3]);
    console.dir(p);
    if(render){
        console.log(p.x + ' BEFORE ' + p.y);
        p.x = p5.map(p.x, 0, 1000, 0, p5.width);
        p.y = p5.map(p.y, 0, 1000, 0, p5.width);
        console.log(p.x + ' AFTER ' + p.y);
    }
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

export const drawStroke = (stroke, p5, render) => {
    if(stroke){
        stroke.forEach((element) => {
            drawPoint(element, p5, render);
        });
    }
}
/**
 * 
 * @param {*} blob 
 * @param {*} name 
 * @param {f} dispatch will be either updateAnim or collectionItemDispatch
 */
export const playPreview = async (blob, name, dispatch, index, setCollectionState, clip) => {
    if(dispatch && clip){
        await dispatch({
            type: 'SET_PREVIEW_FILE', 
            data: {blob : blob, name: name}
        });  
    }else if(dispatch){
        await dispatch({
            type: 'SET_VIEW_FILE',
            data: {blob: blob, name: name}
        })
    }
}

export const previewAnim = async (a, p5canvas, p5, collectionItemDispatch, index, setCollectionState, clip) => {
    try{
        renderAnim(a, 'PREVIEW', p5canvas, p5, collectionItemDispatch, index, setCollectionState, clip);
    }catch(err){
        console.error(err);
    }
}

export const renderAnim = async (a, type, p5canvas, p5, collectionItemDispatch, index, setCollectionState, clip) =>{
    const CCapture = window.CCapture; 
    let capturer = new CCapture({format: 'webm',
//      workersPath: process.env.PUBLIC_URL + '/ccapture/',
        framerate: a.frate
    });
    capturer.start();
    //const startTime = performance.now();
    setBgOverlay(p5, true);
    setBgOverlay(p5, true);
    let frames = [...a.frames];
    if(clip && frames.length > 4){
        frames = frames.splice(0, 4);
        //console.dir("frames:"+frames);
    }
    frames.forEach((f) => {
       setFrameCaptured(f, capturer, p5canvas, p5);
    });
    capturer.stop();
    //const duration = performance.now() - startTime;
    //console.log("Capture took "+duration);
    capturer.save((blob) => {
       if(type === 'PREVIEW'){
            playPreview(blob, a.name, collectionItemDispatch, index, setCollectionState, clip)
                .then(() => {
                if(setCollectionState){
                    if(document.getElementById(`previewCanvas_${index}`)){
                        document.getElementById(`previewCanvas_${index}`).remove();
                    } 
                    setCollectionState({type: 'SET_INDEX', data: index+1}) 
                }else{
                    //console.log('no collection state');
                } 
            });;
        }else if(type === 'DOWNLOAD'){
            saveAs(blob, a.name);
        }
    });
}

export const setBgOverlay = (p5, render) => {
        let c = values.bgc;
        if(render){
            c = p5.color(0);
        }
        p5.background(c);
}

export const setFrameCaptured = async (f, capturer, p5canvas, p5) => {
    const render = true;
    drawFrame(f, p5, render);
    let img = p5.get(0, 0, 600, 600);
    img.loadPixels();
    p5.image(img, 0, 0);
    capturer.capture(p5canvas.elt)
}

export const drawBg = (bg, p5, render) => {
    setBgOverlay(p5, render);
    if(bg && bg.length > 0){
        drawPoints(bg, p5);
    }
}