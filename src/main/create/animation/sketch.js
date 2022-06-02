import { values, CC, CONTROLS } from '../values';
import { isMobile } from 'react-device-detect';
import { downloadAnimAsWebm, drawBg, drawFrame, drawPoint, drawPoints, previewAnim, setBgOverlay } from './anim-util';
import toast from 'buttoned-toaster';
import { getDontShowChoice } from '../../../utils/utils';

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
    let bgOpacity = 0.9;
    let bgFrameOpacity = 1;
   
    const handleNoFramesAlert = () => {
        toast.info(
            {
                message: `Looks like you tried to render an animation with no frames. 
                    Save a frame and try again`,
                toastId: 'no_frames'
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
            drawBg(anim.bg, p5, false, bgOpacity, bgFrameOpacity);
        }
        if(props.controls.next){
            updateControls({type: 'NEXT', data: false});
            updateAnim({type: 'NEXT', data: true});
            drawBg(anim.bg, p5, false, bgOpacity, bgFrameOpacity);
            if(anim.anim.layers && anim.anim.layers.length > 0){
                anim.anim.layers.forEach((layer) => {
                    if(layer.length > anim.anim.frames.length){
                        drawFrame(layer[anim.anim.frames.length], p5, false, false)
                    }
                })
            }
            
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
            isMounted ? redrawLastFrame() : console.warn("unmounted before redrawLastFrame");
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
            redrawLastFrame();
        }
        if(props.controls.privacy !== null 
            && (anim && anim.anim && anim.anim.privacy !== props.controls.privacy)){
            const p = props.controls.privacy;
            updateAnim({type: 'PRIVACY', data: p});
            updateControls({type: 'PRIVACY', data: null});
            updateControls({type: 'SET_PRIVACY', data: p});
            
        }
        if(props.controls.bgOpacity !== bgOpacity){
            bgOpacity = props.controls.bgOpacity;
            redrawLastFrame();
            redrawCurrentFrame();
        }
        if(props.controls.bgFrameOpacity !== bgFrameOpacity){
            bgFrameOpacity = props.controls.bgFrameOpacity;
            redrawLastFrame();
            redrawCurrentFrame();
        }
        if(props.controls.newLayer){
            updateControls({type: 'NEW_LAYER', data: false});
            const dismiss = (id) => {
                toast.dismiss(id)
            }
            const approve = (id) => {
                if(id)toast.dismiss(id);
                updateAnim({type: 'NEW_LAYER', data: true});
            }
            if(window.localStorage.getItem(`dontshow_NEW_LAYER_${anim.anim.userid}`)){
                console.log("item")
                getDontShowChoice(`dontshow_NEW_LAYER_${anim.anim.userid}`)
                    .then((item) => {
                        if(item.choice){
                            approve(false);
                        }
                    })
            }else{
                toast.warn({
                    toastId: 'newLayer',
                    message: `Warning: You are about to add a new layer. 
                        This means your animation will be saved as a layer 
                        and you will return to the first frame, 
                        with ability to draw a new layer over each frame in sequence. 
                        Is this what you intend to do?`,
                    dismissFunc: dismiss,
                    approveFunc: approve,
                    dismissTxt: "Nope",
                    approveTxt: "Yes, take me to the layerverse",
                    canHide: true,
                    dontShowType: `NEW_LAYER_${anim.anim.userid}`
                })
            }
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
                isMounted ? updateControls({type: 'NEXT', data: true}) : console.warn("unmounted");
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
                console.warn('no control found matching provided code');
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
                    console.warn("unmounted while doing stroke");
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
            setBgOverlay(p5, true);
        }
    }

    const setSavedBackground = (props) => {
        if(props.anim.anim && props.anim.anim.frames
            && props.anim.anim.frames.length > 0
            && props.anim.anim.frames[props.anim.anim.frames.length-1].bg){
                updateAnim({type: 'SAVE_BG', data: props.anim.anim.frames[props.anim.anim.frames.length-1].bg});
                updateAnim({type: 'DRAW_BG', data: true});
        }
    }

    const redrawLastFrame = () => {
        setBgOverlay(p5, false, bgOpacity);
        if(anim.anim.lastFrame && anim.anim.lastFrame.points){
            drawPoints(anim.anim.lastFrame.points, p5);
            setBgOverlay(p5, false, bgOpacity);
            
            if((anim.anim.lastFrame.bg && anim.anim.lastFrame.bg.length > 0)){
                drawPoints(anim.anim.lastFrame.bg, p5);
            }else if(anim.anim.bg && anim.anim.bg.length > 0){
                drawPoints(anim.anim.bg, p5);
            }
        }
        
    }

    const redrawCurrentFrame = () => {
        if(anim.bg && anim.bg.length > 0){
            drawPoints(anim.bg, p5);
        }
        if(anim.undos && anim.undos.length > 0){
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
        if(x < 0 || x > p5.width || y < 0 || y > p5.height){
            return false;
        }else{
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

