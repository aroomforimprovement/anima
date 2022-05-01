import { values, CC } from '../values';
import { saveAs } from 'file-saver';

/***
 * DRAWING
 */

export const setBgOverlay = async (p5, render) => {
    let c = values.bgc;
    if(render){
        c = p5.color(0);
    }
    p5.background(c);
}

export const drawBg = async (bg, p5, render) => {
    setBgOverlay(p5, render);
    if(bg && bg.length > 0){
        drawPoints(bg, p5);
    }
}

export const drawFrame = async (f, p5, render, clip) => {
    setBgOverlay(p5, render);
    if(f.bg && f.bg.length > 0){
        
        drawPoints(f.bg, p5, clip);   
    }
    drawPoints(f.points, p5, clip);
}

export const drawPoints = async (points, p5, clip) => {
    //let time = performance.now();
    //const wait = 1000;
    points.forEach((element) => {
    //    let now = performance.now();
    //    while(now - time < wait){
    //        //wait;
    //        now = performance.now() + 1;
    //        console.log(`waiting ${now}`);
    //        console.log(`${time}:${wait}`);
    //    }
    //    console.log(`NOT waiting ${now}`);
    //    console.log(`${time}:${wait}`);
    //    time = performance.now();
        drawStroke(element, p5, clip);            
        
    });
}

export const drawPoint = async (point, p5) => {
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

export const drawStroke = async (stroke, p5, clip) => {
    if(stroke){
        stroke.forEach((point, i) => {
            if(clip){
                if(i%2 === 0){
                    drawPoint(point, p5);
                }
            }else{
                drawPoint(point, p5);
            }
            
        });
    }
}

/***
 * RENDERING
 */

export const previewAnim = async (params) => {
        
        try{
            renderAnim(params);
        }catch(err){
            console.error("Error trying renderAnim: previewAnim");
        }
}

export const previewAnimMobile = async (params) => {
    try{
        renderThumb(params);
    }catch(err){
        console.err(err);
    }
}

export const renderAnim = async (params) => {
    const CCapture = window.CCapture; 
    let capturer = new CCapture({format: 'webm',
        //workersPath: process.env.PUBLIC_URL + '/ccapture/',
        framerate: params.a.frate
    });
    capturer.start();
    const startTime = performance.now();
    setBgOverlay(params.p5, true);
    setBgOverlay(params.p5, true);
    let frames = [...params.a.frames];
    if(params.clip && frames.length > 4){
        frames = frames.splice(0, 4);
    }
    frames.forEach((f, i) => {
        setFrameCaptured(f, capturer, params.p5canvas, params.p5, params.clip);
    });
    capturer.stop();
    const duration = performance.now() - startTime;
    //console.log("Capture took "+duration);
    capturer.save((blob) => {
        if(params.type.indexOf('VIEW') > -1){ 
            playPreview(
                {
                    blob: blob, 
                    name: params.a.name, 
                    updateAnim: params.updateAnim, 
                    collectionItemDispatch: params.collectionItemDispatch,  
                    setCollectionState: params.setCollectionState,
                    clip: params.clip
                }
            ).then(() => {
                //params.mainDispatch ? params.mainDispatch({type: 'PROGRESS_FRAME', data: {max: 0, now: 0}}) : console.log('no main dispatch');
                if(params.setCollectionState && params.type === 'PREVIEW'){
                    params.setCollectionState({type: 'SET_INDEX', data: params.index+1});
                }else if(params.setCollectionState){
                    params.setCollectionState({type: 'SET_VIEW_FILE', data: {blob: blob, name: params.a.name}});
                }else if(params.updateAnim){params.updateAnim({type: 'SET_VIEW_FILE', data: {blob: blob, name: params.a.name}});
                }
            });
        }else if(params.type === 'DOWNLOAD'){
            saveAs(blob, params.a.name);
            playPreview(
                {
                    blob: blob, 
                    name: params.a.name, 
                    updateAnim: params.updateAnim, 
                    collectionItemDispatch: params.collectionItemDispatch}

            );
                //setCollectionState({type:'DOWNLOADED', data: index});
        }else if(params.type === 'DRAWING'){
            playPreview(
                {
                    blob: blob, 
                    name: params.a.name, 
                    updateAnim: params.updateAnim
                } 
            );
        }
    });
    if(!params.drawing){
        params.p5.remove();
    }
}

export const setFrameCaptured = async (f, capturer, p5canvas, p5, clip) => {
    //console.debug("setFrameCaptured");
    const render = true;
    drawFrame(f, p5, render, clip);
    let img = p5.get(0, 0, 600, 600);
    img.loadPixels();
    p5.image(img, 0, 0);
    capturer.capture(p5canvas.elt);
}

export const renderThumb = async (params) => {
        //console.debug("renderThumb");
        setBgOverlay(params.p5, true);
        setBgOverlay(params.p5, true);
        let frames = [...params.a.frames];
        const thumb = frames[0];
        setThumbCaptured(thumb, params.a.name, params.index, params.p5, params.p5canvas,
            params.dispatch, params.setCollectionState);
}

export const setThumbCaptured = async (f, name, index, p5, p5canvas,
    dispatch, setCollectionState) => {
    //console.debug("setThumbCaptured");
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

export const downloadAnimAsWebm = async (params) => {
    params.type = 'DOWNLOAD';
    try{
        renderAnim(params);
        return true;
    }catch(err){
        console.error("Error trying renderAnim: downloadAnimAsWebm");
        return false;
    }
}


 export const playPreview = async (params) => {
    //console.debug("playPreview");
    if(params.collectionItemDispatch && params.clip){
        //console.log("dispatch & clip");
        await params.collectionItemDispatch({
            type: 'SET_PREVIEW_FILE', 
            data: {blob : params.blob, name: params.name}
        });  
    }else if(params.setCollectionState){
        //console.log("dispatch");
        await params.setCollectionState({
            type: 'SET_VIEW_FILE',
            data: {blob: params.blob, name: params.name}
        });
    }else if(params.updateAnim){
        //console.log("dispatch");
        await params.updateAnim({
            type: 'SET_VIEW_FILE',
            data: {blob: params.blob, name: params.name}
        });
    }
}

export const setThumb = async (blob, name, index, dispatch, setCollectionState) => {
    //console.debug("setThumb");
    if(dispatch){
        dispatch({
            type: 'SET_PREVIEW_FILE',
            data: {blob: blob, name: name}
        });
    }else{
        //console.debug('no collection item dispatch');
    }
    if(setCollectionState){
        setCollectionState({type: 'SET_INDEX', data: index+1});
    }else{
        //console.debug('no collection state');
    }
}

