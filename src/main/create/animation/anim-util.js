import { values, CC } from '../values';
import { saveAs } from 'file-saver';

/***
 * DRAWING
 */

export const setBgOverlay = async (p5, render, opacity) => {
    let c = typeof opacity === 'undefined' ? values.bgc : [20, 255*opacity];
    if(render){
        c = p5.color(20);
    }
    p5.background(c);
}

export const drawBg = async (bg, p5, render, bgOpacity, bgFrameOpacity) => {
    setBgOverlay(p5, render, bgOpacity);
    if(bg && bg.length > 0){
        drawPoints({
            points: bg, 
            p5: p5, 
            render: render,
            clip: false, 
            opacity: bgFrameOpacity
        });
    }
}

export const drawFrame = async (params) => {
    if(params.f.bg && params.f.bg.length > 0){
        drawPoints({
            points: params.f.bg, 
            p5: params.p5, 
            clip: params.clip,
            p5canvas: params.p5canvas
        });
    }
    drawPoints({
        points: params.f.points ? params.f.points : [], 
        p5: params.p5, 
        clip: params.clip, 
        capturer: params.capturer, 
        p5canvas: params.p5canvas
    });
}

export const drawPoints = async (params) => {
    params.points.forEach((element, i) => {
        drawStroke({
            stroke: element, 
            p5: params.p5, 
            clip: params.clip, 
            opacity: params.bgFrameOpacity,
            p5canvas: params.p5canvas,
            capturer: params.capturer,
            i: i
        });
    });
}

export const drawPoint = async (point, p5, opacity, capturer, p5canvas, i) => {
    let p = {...point};
    const opa = typeof opacity !== 'undefined' ? 255*opacity : p.pc[3];
    p5.fill(p.pc[0], p.pc[1], p.pc[2], opa);
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
    if(p.r && capturer && i%20 === 0){
        let img = p5.get(0, 0, 600, 600);
        img.loadPixels();
        p5.image(img, 0, 0);
        capturer.capture(p5canvas.elt)
    }
    return true;
}

export const drawStroke = async (params) => {
    if(params.stroke && params.stroke.r){
        drawPoint(params.stroke, params.p5, params.opacity, params.capturer, params.p5canvas, params.i)
    }else if(params.stroke){
        params.stroke.forEach((point, i) => {
            if(params.clip){
                if(i%2 === 0){
                    drawPoint(point, params.p5, params.opacity, params.capturer, params.p5canvas, i);
                }
            }else{
                drawPoint(point, params.p5, params.opacity, params.capturer, params.p5canvas, i);
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
    if(params.index === 'temp'){
        return;
    }else{
        try{
            renderThumb(params);
        }catch(err){
            console.err(err);
        }
    }
}

export const renderAnim = async (params) => {
    const CCapture = window.CCapture; 
    let capturer = new CCapture({format: 'webm',
        //workersPath: process.env.PUBLIC_URL + '/ccapture/',
        framerate: params.a.frate
    });
    capturer.start();
    //const startTime = performance.now();
    setBgOverlay(params.p5, true);
    setBgOverlay(params.p5, true);
    let frames = [...params.a.frames];
    if(params.clip && frames.length > 8){
        frames = frames.splice(0, 8);
    }
    frames.forEach((f, i) => {
        const frameWithLayers = [];
        if(params.a.layers?.length > 0){
            params.a.layers.forEach((layer) => {
                if(layer.length >= i){
                    frameWithLayers.push(layer[i])
                }
            })
        }
        frameWithLayers.push(f);
        setFrameCaptured({
            f: frameWithLayers ? frameWithLayers : [], 
            capturer: capturer, 
            p5canvas: params.p5canvas, 
            p5: params.p5, 
            clip: params.clip
        });
    });
    capturer.stop();
    //const duration = performance.now() - startTime;
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

export const setFrameCaptured = async (params) => {
    console.dir(params.f)
    const render = true;
    let rec = false;
    for(let i = 0; i < params.f.length; i++){
        if(params.f[i]?.points[0]?.r){
            rec = true;
            break;
        }
    }
    if(!rec){
        setBgOverlay(params.p5, render);
    }
    params.f.forEach((layer) => {
        drawFrame({
            f: layer ? layer : [], 
            p5: params.p5, 
            render: render, 
            clip: params.clip, 
            capturer: params.capturer, 
            p5canvas: params.p5canvas
        })
    })
    
    let img = params.p5.get(0, 0, 600, 600);
    img.loadPixels();
    params.p5.image(img, 0, 0);
    params.capturer.capture(params.p5canvas.elt);
}

export const renderThumb = async (params) => {
        setBgOverlay(params.p5, true);
        setBgOverlay(params.p5, true);
        let frames = [...params.a.frames];
        const thumb = frames[0];
        setThumbCaptured(thumb, params.a.name, params.index, params.p5, params.p5canvas,
            params.dispatch, params.setCollectionState);
}

export const setThumbCaptured = async (f, name, index, p5, p5canvas,
    dispatch, setCollectionState) => {
    const render = true;
    drawFrame({
        f: f, 
        p5: p5, 
        render: render,
        p5canvas: p5canvas
    });
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
    if(params.setCollectionState && params.clip){
        await params.setCollectionState({
            type: 'ADD_PREVIEW_FILE', 
            data: {blob : params.blob, name: params.name, index: params.index}
        });  
    }else if(params.setCollectionState){
        await params.setCollectionState({
            type: 'SET_VIEW_FILE',
            data: {blob: params.blob, name: params.name}
        });
    }else if(params.updateAnim){
        await params.updateAnim({
            type: 'SET_VIEW_FILE',
            data: {blob: params.blob, name: params.name}
        });
    }
}

export const setThumb = async (blob, name, index, dispatch, setCollectionState) => {
    if(dispatch)
        dispatch({
            type: 'SET_THUMB_FILE',
            data: {blob: blob, name: name}
        });

    if(setCollectionState){
        setCollectionState({
            type: 'ADD_THUMB_FILE',
            data: {blob: blob, name: name}
        })
    }
        
        //setCollectionState({type: 'SET_INDEX', data: index+1});
}

