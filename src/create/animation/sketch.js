import { values, CC, CONTROLS } from '../values';
import { isMobile } from 'react-device-detect';
import { downloadAnimAsWebm, drawBg, drawPoint, drawPoints, previewAnim, setBgOverlay } from './anim-util';


export const sketch = (p5) => {
    let p5canvas = undefined;
    let controls = values.initialControlState; 
    let dispatch;
    let anim = values.initialAnimState;
    let updateAnim;
    let thisStroke = [];
    let isStroke = false;
    let isMounted = false;
    let isSet = false;

    /**
     *  P5
     */
    p5.setup = () => {
        p5canvas = p5.createCanvas(
            isMobile && p5.displayWidth < values.defaultSize ? p5.displayWidth : values.defaultSize, 
            isMobile && p5.displayWidth < values.defaultSize ? p5.displayWidth : values.defaultSize);
        p5.background(values.initialBgc[0], values.initialBgc[3]);
        p5.noStroke();
    }

    p5.updateWithProps = (props) => {
        isMounted = true;
        if(props.controls){ controls = props.controls; }
        if(props.dispatch && !dispatch){ dispatch = props.dispatch; }
        if(props.anim){ 
            anim = props.anim;
            if(props.anim.isSet && !isSet){
                isSet = true;
                setSavedBackground(props);
                redrawLastFrame();
            }
        }
        if(props.updateAnim && !updateAnim){ updateAnim = props.updateAnim; }
        if(props.controls.enable){
            dispatch({type: 'ENABLE', data: false});
            updateAnim({type: 'ENABLED', data: true});
        }else if(props.controls.disable){
            dispatch({type: 'DISABLE', data: false});
            updateAnim({type: 'ENABLED', data: false});
        }
        if(controls.undo){
            dispatch({type: 'UNDO', data: false});
            updateAnim({type: 'UNDO_STROKE', data: true});
        }else if(controls.redo){
            dispatch({type: 'REDO', data: false});
            updateAnim({type: 'REDO_STROKE'});
        }
        if((props.anim.redid && anim.redid.length > 0) ||
            (anim.undid && anim.undid.length > 0)){
            redrawLastFrame();
            redrawCurrentFrame();
        }
        if(props.controls.frate && anim.anim.frate && props.controls.frate !== anim.anim.frate){
            updateAnim({type: 'FRATE', data: props.controls.frate});
        }
        if(props.controls.wipe){
            dispatch({type: 'WIPE', data: false});
            updateAnim({type: 'WIPE'});
            wipeCurrentFrame();
        }
        if(props.controls.saveBg){
            dispatch({type: 'SAVE_BG', data: false});
            updateAnim({type: 'SAVE_BG', data: false});
            updateAnim({type: 'DRAW_BG', data: true});
        }
        if(props.controls.drawBg){
            dispatch({type: 'DRAW_BG', data: false});
            updateAnim({type: 'DRAW_BG', data: true});
            drawBg(anim.bg, p5);
        }
        if(props.controls.next){
            dispatch({type: 'NEXT', data: false});
            updateAnim({type: 'NEXT', data: true});
            drawBg(anim.bg, p5);
        }
        if(props.controls.download){
            dispatch({type: 'DOWNLOAD', data: false});
            if(anim.anim.frames.length < 1){
                alert("Looks like you tried to render an animation with no frames. Save a frame and try again");
            }else{
                downloadAnimAsWebm(anim.anim, p5canvas, p5);
            }            
        }
        if(props.controls.preview && props.anim.isPreviewOpen){
                dispatch({type: 'PREVIEW', data: false});        
                console.log(props.anim.isPreviewOpen);
                previewAnim(anim.anim, p5canvas, p5, updateAnim)
                    .then(() => {
                        p5.resizeCanvas(10, 10);
                });
        }else if(props.controls.preview){
            if(anim.anim.frames.length < 1){
                alert("Looks like you tried to render an animation with no frames. Save a frame and try again");
            }else{
                dispatch({type: 'DISABLE', data: true});
                updateAnim({type: 'PREVIEW', data: anim.anim});
            }
        }
        if(props.controls.endPreview){
            dispatch({type: 'END_PREVIEW', data: false});
            updateAnim({type: 'END_PREVIEW', data: false});
            p5.resizeCanvas(isMobile ? p5.displayWidth : values.defaultSize,
                isMobile ? p5.displayWidth : values.defaultSize);
            redrawLastFrame();
        }
        if(props.controls.save){
            dispatch({type: 'SAVE', data: false});
            updateAnim({type: 'SAVE', data: {size: p5.width}});
            p5.resizeCanvas(20, 20);
        }
        if(props.anim.saveClose){
            console.log('resizing');
            p5.resizeCanvas(isMobile ? p5.displayWidth : values.defaultSize,
                isMobile ? p5.displayWidth : values.defaultSize);
            updateAnim({type: 'SAVE_CLOSE', data: false});
        }
        if(props.controls.privacy !== null 
            && (anim && anim.anim && anim.anim.privacy !== props.controls.privacy)){
            const p = props.controls.privacy;
            updateAnim({type: 'PRIVACY', data: p});
            dispatch({type: 'PRIVACY', data: null});
            dispatch({type: 'SET_PRIVACY', data: p});
            
        }
        
        return () => { isMounted = false};
    }

    p5.draw = () => {
        
    }

    p5.mousePressed = () => {
        //console.log("mousePressed");
        if(anim.isSaveOpen){
            //console.log("isSaveOpen");
            return true;
        }
        handlePressed(p5.mouseX, p5.mouseY);
        //if(isPointOnCanvas(p5.mouseX, p5.mouseY) && anim.enabled){
        //    return true;
        //}
        //return false;
        return (!isPointOnCanvas(p5.mouseX, p5.mouseY));// || (isPointOnCanvas(p5.mouseX, p5.mouseY) && !anim.enabled));
        //return true;
    }
    //p5.touchStarted = () => {
    //    console.log("touchStarted");
    //    return isPointOnCanvas(p5.mouseX, p5.mouseY);
    //}
    //p5.touchStarted = () => {
    //    //console.debug("touch started");
    //    if(p5.touches.length === 1){
    //        return handlePressed(p5.mouseX, p5.mouseY)
    //    }
    //    return false;
    //}
    p5.mouseDragged = () => {
        //console.debug("mouse dragged");
        handleDragged(p5.mouseX, p5.mouseY);
        return !isPointOnCanvas(p5.mouseX, p5.mouseY);
    }
    //p5.touchMoved = () => {
    //    if(p5.touches.length === 1){
    //        handleDragged(p5.mouseX, p5.mouseY);
    //    }
    //    return !isPointOnCanvas(p5.mouseX, p5.mouseY);
    //}

    p5.mouseReleased = () => {
        handleReleased(p5.mouseX, p5.mouseY);
        return !isPointOnCanvas(p5.mouseX, p5.mouseY);
    }
    //p5.touchEnded = () => {
    //    //console.debug("touch ended");
    //    //console.dir(p5.touches);
    //    if(p5.touches.length <= 1){
    //        return handleReleased(p5.mouseX, p5.mouseY);
    //    }
    //    return false;
    //}

    const handlePressed = (x, y) => {
        //console.log("handlePressed");
        if(anim.enabled && !isStroke && isPointOnCanvas(x,y)){
            startStroke(x, y);
            return true;
        }
        return false;
    }

    const startStroke = (x, y) => {
        isStroke = true;
        return setPointDrawn(x, y);
    }

    const handleDragged = (x, y ) => {
        if(anim.enabled && isStroke && isPointOnCanvas(x,y)){
            return setPointDrawn(x, y);
        }
        return false;
    }

    const handleReleased = (x, y) => {
        if(anim.enabled && isStroke && isPointOnCanvas(x,y)){
            return endStroke(x, y);
        }
        return false;
    }

    const endStroke = (x, y) => {
        isStroke = false;
        return setPointDrawn(x, y);
    }

    const setControlTriggered = (controlObj) => {
        switch(controlObj.v){
			case CC.NEXT:
                isMounted ? dispatch({type: 'NEXT', data: true}) : console.log("unmounted");
    			break;
			case CC.BG:
                dispatch({type: 'DRAW_BG', data: true})
		    	break;
			case CC.SWITCH_PEN_BW:
			    dispatch({type: 'SWITCH_PEN_BW', data: true});
			break;
			case CC.UNDO_STROKE:
                dispatch({type: 'UNDO', data: true});
                break;
			case CC.REDO_STROKE:
                dispatch({type: 'REDO', data: true});
	    		break;
            case CC.WIPE:
                dispatch({type: 'WIPE', data: true});
                break;
            default:
                //console.log('no control found');
		}
    }

    p5.keyPressed = () => {
        if(!anim.enabled || !controls.shortcutsEnabled 
            || !isPointOnCanvas(p5.mouseX, p5.mouseY)){
            return;
        }

        let controlObj;
        if(p5.key !== ''){
            CONTROLS.forEach((CONTROL_OBJ) => {
                if(p5.key === CONTROL_OBJ.k){
                    controlObj = CONTROL_OBJ;
                }
            })
        }
        
        if(!controlObj){
            //console.warn('key pressed but no shortcut exists for key ['+p5.key+']');
            return;
        }
        switch(controlObj.t){
            case CC.TYPE_MODE:
                setMode(controlObj);
                break;
            case CC.TYPE_SIZE:
                setPenSize(controlObj);
                break;
            case CC.TYPE_COLOUR:
                setPenColour(controlObj);
                break;
            case CC.TYPE_TRIGGER:
                setControlTriggered(controlObj);
                break;
            default:
                //console.warn('key pressed but no shortcut exists for key ['+p5.key+']');
        }
    }

    /**
     * 
     * DRAWING ACTIONS 
     */
    const setPointDrawn = (x, y) => {
        const p = getPointObj(x, y);
        if(drawPoint(p, p5)){
            thisStroke.push(p);
            if(!isStroke){
                //save and clear stroke
                if(isMounted){
                    updateAnim({type: 'DO_STROKE', data: thisStroke});
                    thisStroke = []; 
                }else{
                    //console.warn("unmounted while doing stroke");
                }
                return true;
            }
        }else{
            return false;
        }
    }

    const wipeCurrentFrame = () => {
        p5.background(values.initialBgc);
        if(anim.anim && anim.anim.lastFrame && anim.anim.lastFrame.points
            && anim.anim.lastFrame.points.length > 0){
            drawPoints(anim.anim.lastFrame.points, p5);

            setBgOverlay(p5);
            //if(anim.anim.lastFrame.bg && anim.anim.lastFrame.bg.length > 0){
            //    drawPoints(anim.anim.lastFrame.bg, p5);
            //}
        }
    }

    const setSavedBackground = (props) => {
        //console.log("setSavedBackground");
        if(props.anim.anim && props.anim.anim.frames
            && props.anim.anim.frames.length > 0
            && props.anim.anim.frames[props.anim.anim.frames.length-1].bg){
                //console.log("saving background");
                updateAnim({type: 'SAVE_BG', data: props.anim.anim.frames[props.anim.anim.frames.length-1].bg});
                updateAnim({type: 'DRAW_BG', data: true});
        }
    }

    const redrawLastFrame = () => {
        //console.log("redrawLastFrame");
        setBgOverlay(p5);
        if(anim.anim.lastFrame && anim.anim.lastFrame.points){
            //console.log('drawing last frame');
            drawPoints(anim.anim.lastFrame.points, p5);
            setBgOverlay(p5);
            
            if((anim.anim.lastFrame.bg && anim.anim.lastFrame.bg.length > 0)){
                //console.log('drawing lastframe background');
                drawPoints(anim.anim.lastFrame.bg, p5);
            }else if(anim.anim.bg && anim.anim.bg.length > 0){
                //console.log('drawing background');
                drawPoints(anim.anim.bg, p5);
            }
        }
        
    }

    const redrawCurrentFrame = () => {
        //console.log("redrawCurrentFrame");
        if(anim.bg && anim.bg.length > 0){
            //console.log('drawing background');
            drawPoints(anim.bg, p5);
        }
        if(anim.undos && anim.undos.length > 0){
            //console.log("drawing undos");
            drawPoints(anim.undos, p5);
        }
    }

    
    /**
     * 
     *  DRAWING OBJ UTILS 
     */    
    const getPointObj = (x, y) => {
        return {
            x : x,
            y : y,
            size: p5.width,
            pc: controls.pc,
            ps: controls.ps,
            m: controls.mode
        }
    }

    /**
     *  LOGIC UTILS
     */

    const isPointOnCanvas = (x, y) => {
        //if(x < 0 || x > p5.width || y < 0 || y > p5.height)
        if(x < 0 || x > p5.width || y < 0 || y > p5.height){
            //console.log("not on canvas")
            return false;
        }else{
            //console.log("on canvas")
            return true;
        }
        
    }

    /**
     *  CONTROL SWITCHES
     */
    const setMode = (controlObj) => {
        dispatch({type: 'MODE', data: controlObj.v});
    }

    const setPenSize = (controlObj) => {
        dispatch({type: 'PS', data: controlObj.size});
    }

    const setPenColour = (controlObj) => {
		dispatch({type: 'PC', data: values[controlObj.n.toLowerCase()]});
	}
}

