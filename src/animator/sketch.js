import { values } from './values';
import { CC, CONTROLS }  from './controls';
import { saveAs } from 'file-saver';

let CCapture;
 
console.log(window);
export const sketch = (p5) => {
    let p5canvas = undefined;
    let controls = values.initialControlState; 
    let dispatch;
    let anim = values.initialAnimState;
    let updateAnim;
    let thisStroke = [];
    let isStroke = false;
    let capturer;

    /**
     *  P5
     */
    p5.setup = () => {
        p5canvas = p5.createCanvas(600, 600);
        p5.background(values.initialBgc[0], values.initialBgc[3]);
        p5.noStroke();
        console.log(window);
        CCapture = window.CCapture;

    }

    p5.updateWithProps = (props) => {
        console.log("PROP CONTROLS:");
        console.dir(props.controls);
        console.log("PROP ANIM: ");
        console.dir(props.anim);
        if(props.controls){ controls = props.controls; }
        if(props.dispatch){ dispatch = props.dispatch; }
        if(props.anim){ anim = props.anim; }
        if(props.updateAnim){ updateAnim = props.updateAnim; }
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
            updateAnim({type: 'SAVE_BG'})
        }
        if(props.controls.drawBg){
            dispatch({type: 'DRAW_BG', data: false});
            updateAnim({type: 'DRAW_BG', data: true});
            drawBg(anim.bg);
        }
        if(props.controls.next){
            dispatch({type: 'NEXT', data: false});
            updateAnim({type: 'NEXT', data: true});
            drawBg(anim.bg);
        }
        if(props.controls.download){
            dispatch({type: 'DOWNLOAD', data: false});
            if(anim.anim.frames.length < 1){
                alert("Looks like you tried to render an animation with no frames. Save a frame and try again");
            }else{
                downloadAnimAsGif(anim.anim);
            }            
        }
        if(props.controls.preview){
            dispatch({type: 'PREVIEW', data: false});
            if(anim.anim.frames.length < 1){
                alert("Looks like you tried to render an animation with no frames. Save a frame and try again");
            }else{
                updateAnim({type: 'PREVIEW', data: anim.anim});
                dispatch({type: 'DISABLE', data: true});
                previewAnim(anim.anim);
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
            default:
                console.warn('key pressed but no shortcut exists for key ['+p5.key+']');
        }
    }

    /**
     * 
     * DRAWING ACTIONS 
     */

    const drawPoint = (p) => {
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

    const setPointDrawn = (x, y) => {
            let p = getPointObj(x, y);
            if(drawPoint(p)){
                thisStroke.push(p);
                if(!isStroke){
                    //save and clear stroke
                    updateAnim({type: 'DO_STROKE', data: thisStroke});
                    thisStroke = [];   
                }
            }else{
                return false;
            }
            
            return isPointOnCanvas(x, y);
    }

    const wipeCurrentFrame = () => {
        p5.background(values.initialBgc);
        if(anim.lastFrame && anim.lastFrame.length > 0){
            drawPoints(anim.bg);
        }
        setBgOverlay();
    }

    const redrawCurrentFrame = () => {
        p5.background(values.initialBgc);
        if(anim.lastFrame && anim.lastFrame.length > 0){
            drawPoints(anim.bg);
        }
        drawBg(anim.bg);
        if(anim.undos && anim.undos.length > 0){
            drawPoints(anim.undos);
        }
    }

    const drawPoints = (points) => {
        points.forEach((element) => {
            drawStroke(element);
        });
    }

    const drawStroke = (stroke) => {
        stroke.forEach((element) => {
            drawPoint(element);
        });
    }

    const drawBg = (bg) => {
        setBgOverlay();
        if(bg && bg.length > 0){
            drawPoints(anim.bg);
        }
    }

    const setBgOverlay = () => {
        p5.background(values.bgc);
    }

    /**
     * 
     *  DOWNLOAD / PREVIEW 
     */
    

    const downloadAnimAsGif = (a) => {
        renderAnim(a, 'DOWNLOAD');
    }

    const previewAnim = async (a) => {
        renderAnim(a, 'PREVIEW');
    }

    const renderAnim = (a, type) => {
        capturer = new CCapture({format: 'gif',
             workersPath: process.env.PUBLIC_URL + '/ccapture/',
             framerate: a.frate
         });
         capturer.start();
         setBgOverlay();
         setBgOverlay();
         a.frames.forEach((f) => {
            setFrameCaptured(f, capturer);
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

    const playPreview = (blob, name) => {

        updateAnim({type: 'PLAY_PREVIEW', data: {blob: blob, name: name}});
    }

    

     const setFrameCaptured = async (f, capturer) => {
        drawFrame(f)
                let img = p5.get(0, 0, 600, 600);
                img.loadPixels();
                p5.image(img, 0, 0);
                capturer.capture(p5canvas.elt)
     }


    const drawFrame = (f) => {
        setBgOverlay();
        drawPoints(f.bg);
        drawPoints(f.points);
    }
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
		//console.log("Creation.setPenColour(" + controlObj.n + ")");
		let colour;
		switch(controlObj.v){
			case CC.BG_SOLID:
			colour = this.bgc;
			break;
			case CC.BG_SHADE:
			colour = this.bgs;
			break;
			case CC.FG_SOLID:
			colour = this.fgc;
			break;
			case CC.FG_SHADE:
			colour = this.fgs;
			break;
			default:
			colour = p5.color(controlObj.arr[0], controlObj.arr[1], controlObj.arr[2], controlObj.arr[3]);
		}
		dispatch({type: 'PC', data: colour});
	}
}

