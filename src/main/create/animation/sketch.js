import { values, CC, CONTROLS } from '../values';
import { isMobile } from 'react-device-detect';
import { downloadAnimAsWebm, drawBg, drawPoint, drawPoints, previewAnim, setBgOverlay } from './anim-util';

export const sketch = (p5) => {
    let p5canvas = undefined;
    let controls = values.initialControlState; 
    let updateControls;
    let mainDispatch;
    let anim = values.initialAnimState;
    let updateAnim;
    let thisStroke = [];
    let isStroke = false;
    let isMounted = false;
    let isSet = false;
    let toast;

    const handleNoFramesAlert = () => {
        const dismiss = (id) => {
            toast.dismiss(id);
        }
        toast.info(
            {
                approveFunc: dismiss,
                dismissFunc: dismiss,
                message: `Looks like you tried to render an animation with no frames. 
                    Save a frame and try again`,
                dismissTxt: "OK", 
                approveTxt:"Cool"
            }
        );
    }
    /**
     *  P5
     */
    p5.setup = () => {
        p5canvas = p5.createCanvas(
            isMobile && p5.displayWidth < values.defaultSize 
            ? p5.displayWidth 
            : values.defaultSize, 
            isMobile && p5.displayWidth < values.defaultSize 
            ? p5.displayWidth 
            : values.defaultSize);
        p5.background(values.initialBgc[0], values.initialBgc[3]);
        p5.noStroke();
        p5.noLoop();
    }

    p5.updateWithProps = (props) => {
        isMounted = true;
        if(!toast && props.toast){ toast = props.toast};
        if(props.controls){ controls = props.controls; }
        if(!updateControls && props.updateControls){ updateControls = props.updateControls; }
        if(!mainDispatch && props.mainDispatch){mainDispatch = props.mainDispatch}
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
            updateControls({type: 'ENABLE', data: false});
            updateAnim({type: 'ENABLED', data: true});
        }else if(props.controls.disable){
            updateControls({type: 'DISABLE', data: false});
            updateAnim({type: 'ENABLED', data: false});
        }
        if(controls.undo){
            updateControls({type: 'UNDO', data: false});
            updateAnim({type: 'UNDO_STROKE', data: true});
        }else if(controls.redo){
            updateControls({type: 'REDO', data: false});
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
            updateControls({type: 'WIPE', data: false});
            updateAnim({type: 'WIPE'});
            wipeCurrentFrame();
        }
        if(props.controls.saveBg){
            updateControls({type: 'SAVE_BG', data: false});
            updateAnim({type: 'SAVE_BG', data: false});
            updateAnim({type: 'DRAW_BG', data: true});
        }
        if(props.controls.drawBg){
            updateControls({type: 'DRAW_BG', data: false});
            updateAnim({type: 'DRAW_BG', data: true});
            drawBg(anim.bg, p5);
        }
        if(props.controls.next){
            updateControls({type: 'NEXT', data: false});
            updateAnim({type: 'NEXT', data: true});
            drawBg(anim.bg, p5);
        }
        if(props.controls.download){
            updateControls({type: 'DOWNLOAD', data: false});
            if(anim.anim.frames.length < 1){
                handleNoFramesAlert();
            }else{
                downloadAnimAsWebm(
                    {
                        a: anim.anim, 
                        p5canvas: p5canvas, 
                        p5: p5,
                        drawing: true
                    }).then(res => res 
                        ? toast.success("Anim downloaded") 
                        : toast.error("Problem downloading anim")
                    ).catch(err => console.error(err));
            }            
        }
        if(props.controls.preview && props.anim.isPreviewOpen){
                updateControls({type: 'PREVIEW', data: false});        
                previewAnim(
                    {
                        a: anim.anim, 
                        type: 'DRAWING',
                        p5canvas: p5canvas,
                        p5: p5,
                        updateAnim: updateAnim,
                        clip: false,
                        drawing: true,
                        mainDispatch: mainDispatch
                    }
                ).then(() => {
                        p5.resizeCanvas(10, 10);
                });
        }else if(props.controls.preview){
            if(anim.anim.frames.length < 1){
                updateControls({type: 'PREVIEW', data: false});
                handleNoFramesAlert();
            }else{
                updateControls({type: 'DISABLE', data: true});
                updateAnim({type: 'PREVIEW', data: anim.anim});
            }
        }
        if(props.controls.endPreview){
            updateControls({type: 'END_PREVIEW', data: false});
            updateAnim({type: 'END_PREVIEW', data: false});
            isMounted ? p5.resizeCanvas(isMobile ? p5.displayWidth : values.defaultSize,
                isMobile ? p5.displayWidth : values.defaultSize) : console.debug("unmounted before canvas resize");
            isMounted ? redrawLastFrame() : console.log("unmounted before redrawLastFrame");
        }
        if(props.controls.save){
            updateControls({type: 'SAVE', data: false});
            updateAnim({type: 'SAVE', data: {size: p5.width}});
            p5.resizeCanvas(20, 20);
        }
        if(props.anim.saveClose){
            p5.resizeCanvas(isMobile ? p5.displayWidth : values.defaultSize,
                isMobile ? p5.displayWidth : values.defaultSize);
            updateAnim({type: 'SAVE_CLOSE', data: false});
        }
        if(props.controls.privacy !== null 
            && (anim && anim.anim && anim.anim.privacy !== props.controls.privacy)){
            const p = props.controls.privacy;
            updateAnim({type: 'PRIVACY', data: p});
            updateControls({type: 'PRIVACY', data: null});
            updateControls({type: 'SET_PRIVACY', data: p});
            
        }
        
        return () => { isMounted = false};
    }

    p5.draw = () => {
        
    }

    p5.mousePressed = () => {
        if(anim.isSaveOpen){
            return true;
        }
        handlePressed(p5.mouseX, p5.mouseY);
        return (!isPointOnCanvas(p5.mouseX, p5.mouseY));
    }

    //p5.touchStarted = () => {return true;}

    p5.mouseDragged = () => {
        handleDragged(p5.mouseX, p5.mouseY);
        return !isPointOnCanvas(p5.mouseX, p5.mouseY);
    }

    //p5.touchMoved = () => {return true;}

    p5.mouseReleased = () => {
        handleReleased(p5.mouseX, p5.mouseY);
        return !isPointOnCanvas(p5.mouseX, p5.mouseY);
    }

    //p5.touchEnded = () => {return true;}

    const handlePressed = (x, y) => {
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
                isMounted ? updateControls({type: 'NEXT', data: true}) : console.log("unmounted");
    			break;
			case CC.BG:
                updateControls({type: 'DRAW_BG', data: true})
		    	break;
			case CC.SWITCH_PEN_BW:
			    updateControls({type: 'SWITCH_PEN_BW', data: true});
			break;
			case CC.UNDO_STROKE:
                updateControls({type: 'UNDO', data: true});
                break;
			case CC.REDO_STROKE:
                updateControls({type: 'REDO', data: true});
	    		break;
            case CC.WIPE:
                updateControls({type: 'WIPE', data: true});
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
                    const stk = [...thisStroke];
                    thisStroke = []; 
                    updateAnim({type: 'DO_STROKE', data: stk});
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
        updateControls({type: 'MODE', data: controlObj.v});
    }

    const setPenSize = (controlObj) => {
        updateControls({type: 'PS', data: controlObj.size});
    }

    const setPenColour = (controlObj) => {
		updateControls({type: 'PC', data: values[controlObj.n.toLowerCase()]});
	}
}
