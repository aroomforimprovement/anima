import { values } from './values';
import { CC, CONTROLS }  from './controls';
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

    /**
     *  P5
     */
    p5.setup = () => {
        p5canvas = p5.createCanvas(600, 600);
        p5.background(values.initialBgc[0], values.initialBgc[3]);
        p5.noStroke();
    }

    p5.updateWithProps = (props) => {
        isMounted = true;
        console.log("PROP CONTROLS:");
        console.dir(props.controls);
        console.log("PROP ANIM: ");
        console.dir(props.anim);
        if(props.controls){ controls = props.controls; }
        if(props.dispatch && !dispatch){ dispatch = props.dispatch; }
        if(props.anim){ anim = props.anim; }
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
            updateAnim({type: 'SAVE_BG', data: true});
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
        if(props.controls.preview){
            dispatch({type: 'PREVIEW', data: false});
            if(anim.anim.frames.length < 1){
                alert("Looks like you tried to render an animation with no frames. Save a frame and try again");
            }else{
                updateAnim({type: 'PREVIEW', data: anim.anim});
                dispatch({type: 'DISABLE', data: true});
                previewAnim(anim.anim, p5canvas, p5, updateAnim);
            }
        }
        if(props.controls.endPreview){
            dispatch({type: 'END_PREVIEW', data: false});
            updateAnim({type: 'END_PREVIEW', data: false});
        }
        if(props.controls.save){
            dispatch({type: 'SAVE', data: false});
            updateAnim({type: 'SAVE', data: true});
        }
        if(props.controls.privacy !== null){
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
        return handlePressed(p5.mouseX, p5.mouseY);
    }
    p5.touchStarted = () => {
        if(p5.touches.length === 1){
            return handlePressed(p5.mouseX, p5.mouseY)
        }
        return false;
    }
    p5.mouseDragged = () => {
        return handleDragged(p5.mouseX, p5.mouseY);
    }
    p5.touchMoved = () => {
        if(p5.touches.length === 1){
            return handleDragged(p5.mouseX, p5.mouseY);
        }
        return false;
    }
    p5.mouseReleased = () => {
        return handleReleased(p5.mouseX, p5.mouseY);
    }
    p5.touchEnded = () => {
        if(p5.touches.length === 1){
            return handleReleased(p5.mouseX, p5.mouseY);
        }
        return false;
    }

    const handlePressed = (x, y) => {
        if(anim.enabled && !isStroke && isPointOnCanvas(x,y)){
            return startStroke(x, y);
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
                console.log('no control found');
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
            console.warn('key pressed but no shortcut exists for key ['+p5.key+']');
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
                console.warn('key pressed but no shortcut exists for key ['+p5.key+']');
        }
    }

    /**
     * 
     * DRAWING ACTIONS 
     */

    const setPointDrawn = (x, y) => {
            let p = getPointObj(x, y);
            if(drawPoint(p, p5)){
                thisStroke.push(p);
                if(!isStroke){
                    //save and clear stroke
                    if(isMounted){
                        updateAnim({type: 'DO_STROKE', data: thisStroke});
                        thisStroke = []; 
                    }else{
                        console.warn("unmounted while doing stroke");
                    }
                     
                }
            }else{
                return false;
            }
            
            return isPointOnCanvas(x, y);
    }

    const wipeCurrentFrame = () => {
        p5.background(values.initialBgc);
        if(anim.lastFrame && anim.lastFrame.length > 0){
            drawPoints(anim.bg, p5);
        }
        setBgOverlay();
    }

    const redrawCurrentFrame = () => {
        p5.background(values.initialBgc);
        if(anim.lastFrame && anim.lastFrame.length > 0){
            drawPoints(anim.bg, p5);
        }
        drawBg(anim.bg, p5);
        if(anim.undos && anim.undos.length > 0){
            drawPoints(anim.undos, p5);
        }
    }




    /**
     * 
     *  DOWNLOAD / PREVIEW 
     */
    
    /**
     * 
     *  DRAWING OBJ UTILS 
     */
    

    const getPointObj = (x, y) => {
        return {
            x : x,
            y : y,
            pc: controls.pc,
            ps: controls.ps,
            m: controls.mode
        }
    }



    /**
     *  LOGIC UTILS
     */

    const isPointOnCanvas = (x, y) => {
        if(x < 0 || x > p5.width || y < 0 || y > p5.height)
            return false;
        return true;
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

