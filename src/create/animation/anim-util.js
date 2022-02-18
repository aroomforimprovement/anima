import { values, CC } from '../values';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';


/***
 * DRAWING
 */

export const setBgOverlay = (p5, render) => {
    let c = values.bgc;
    if(render){
        c = p5.color(0);
    }
    p5.background(c);
}

export const drawBg = (bg, p5, render) => {
    setBgOverlay(p5, render);
    if(bg && bg.length > 0){
        drawPoints(bg, p5);
    }
}

export const drawFrame = (f, p5, render) => {
    setBgOverlay(p5, render);
    if(f.bg && f.bg.length > 0){
        drawPoints(f.bg, p5);   
    }
    drawPoints(f.points, p5);
}

export const drawPoints = (points, p5) => {
        points.forEach((element) => {
            drawStroke(element, p5);
        });
}

export const drawPoint = (point, p5) => {
    let p = {...point};
    p5.fill(p.pc[0], p.pc[1], p.pc[2], p.pc[3]);
    if(p.size !== p5.width){
        p.x = p5.map(p.x, 0, p.size ? p.size : values.defaultSize, 0, p5.width);
        p.y = p5.map(p.y, 0, p.size ? p.size : values.defaultSize, 0, p5.height);
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

export const drawStroke = (stroke, p5) => {
    if(stroke){
        stroke.forEach((element) => {
            drawPoint(element, p5);
        });
    }
}

/***
 * RENDERING
 */

export const previewAnim = async (a, type, p5canvas, p5, 
    collectionItemDispatch, index, setCollectionState, 
    clip, drawing) => {
    
        try{
            renderAnim(a, type, p5canvas, p5, 
                collectionItemDispatch, index, setCollectionState, clip, drawing);
        }catch(err){
            console.error(err);
        }
}

export const previewAnimMobile = async (a, p5canvas, p5, 
    dispatch, index, setCollectionState) => {
    try{
        renderThumb(a, p5canvas, p5, 
            dispatch, index, setCollectionState);
    }catch(err){
        console.err(err);
    }
}

export const renderAnim = async (a, type, p5canvas, p5, 
    dispatch, index, setCollectionState, 
    clip, drawing) =>{
    
        const CCapture = window.CCapture; 
        let capturer = new CCapture({format: 'webm',
        //workersPath: process.env.PUBLIC_URL + '/ccapture/',
            framerate: a.frate
        });
        capturer.start();
        const startTime = performance.now();
        setBgOverlay(p5, true);
        setBgOverlay(p5, true);
        let frames = [...a.frames];
        if(clip && frames.length > 4){
            frames = frames.splice(0, 4);
        }
        frames.forEach((f) => {
        setFrameCaptured(f, capturer, p5canvas, p5);
        });
        capturer.stop();
        const duration = performance.now() - startTime;
        console.log("Capture took "+duration);
        capturer.save((blob) => {
            if(type === 'PREVIEW'){ 
                playPreview(blob, a.name, dispatch, index, setCollectionState, clip)
                    .then(() => {
                    if(setCollectionState){
                        setCollectionState({type: 'SET_INDEX', data: index+1});
                    }else{
                        console.debug('no collection state');
                    } 
                });;
            }else if(type === 'DOWNLOAD'){
                saveAs(blob, a.name);
            }else if(type === 'DRAWING'){
                playPreview(blob, a.name, dispatch);
            }
        });
        if(!drawing){
            p5.remove();
        }
}

export const setFrameCaptured = async (f, capturer, p5canvas, p5) => {
    const render = true;
    drawFrame(f, p5, render);
    let img = p5.get(0, 0, 600, 600);
    img.loadPixels();
    p5.image(img, 0, 0);
    capturer.capture(p5canvas.elt);
}

export const renderThumb = async (a, p5canvas, p5, 
    dispatch, index, setCollectionState) => {
        console.debug("renderAnimMobile");
        setBgOverlay(p5, true);
        setBgOverlay(p5, true);
        let frames = [...a.frames];
        const thumb = frames[0];
        setThumbCaptured(thumb, a.name, index, p5, p5canvas,
            dispatch, setCollectionState);
}

export const setThumbCaptured = async (f, name, index, p5, p5canvas,
    dispatch, setCollectionState) => {
    console.debug("setThumbCaptured");
    const render = true;
    drawFrame(f, p5, render);
    let img = p5.get(0, 0, 600, 600);
    img.loadPixels();
    p5.image(img, 0, 0);
    
    p5canvas.canvas.toBlob((blob) => {
        setThumb(blob, name, index, dispatch, setCollectionState);
        p5.remove();
    });

}

export const downloadAnimAsWebm = (a, p5canvas, p5) => {
    try{
        renderAnim(a, 'DOWNLOAD', p5canvas, p5);
    }catch(err){
        console.error(err);
        toast.error("Error downloading file");
    }
}

/**
 * 
 * @param {*} blob 
 * @param {*} name 
 * @param {f} dispatch will be either updateAnim or collectionItemDispatch
 */
 export const playPreview = async (blob, name, dispatch, clip) => {
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

export const setThumb = async (blob, name, index, dispatch, setCollectionState) => {
    if(dispatch){
        dispatch({
            type: 'SET_PREVIEW_FILE',
            data: {blob: blob, name: name}
        });
    }else{
        console.debug('no collection item dispatch');
    }
    if(setCollectionState){
        setCollectionState({type: 'SET_INDEX', data: index+1});
    }else{
        console.debug('no collection state');
    }
}

