import { values } from './values';
import { CC, CONTROLS }  from './controls';

export const sketch = (p5) => {
    let controls = values.initialControlState;
    let dispatch;
    let anim = values.initialAnimState;
    let updateAnim;
    let thisStroke = [];
    let isStroke = false;
    
    /**
     *  P5
     */
    p5.setup = () => {
        p5.createCanvas(600, 600);
        p5.background(values.backgroundColour);
        p5.noStroke();
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
        
        if(controls.undo){
            dispatch({type: 'UNDO', data: false});
            updateAnim({type: 'UNDO_STROKE', data: true});
        }else if(controls.redo){
            dispatch({type: 'REDO', data: false});
            updateAnim({type: 'REDO_STROKE'});
        }
        if(anim.redid && anim.redid.length > 0){
            //redraw stroke
            console.log("redraw stroke");
        }else if(anim.undid && anim.undid.length > 0){
            //undraw stroke
            console.log("undraw stroke");
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
        if(controls.enabled && !isStroke && isPointOnCanvas(x,y)){
            return startStroke(x, y);
        }
        return false;
    }

    const startStroke = (x, y) => {
        isStroke = true;
        return setPointDrawn(x, y);
    }

    const handleDragged = (x, y ) => {
        if(controls.enabled && isStroke && isPointOnCanvas(x,y)){
            return setPointDrawn(x, y);
        }
        return false;
    }

    const handleReleased = (x, y) => {
        if(controls.enabled && isStroke && isPointOnCanvas(x,y)){
            return endStroke(x, y);
        }
        return false;
    }

    const endStroke = (x, y) => {
        isStroke = false;
        return setPointDrawn(x, y);
    }

    p5.keyPressed = () => {
        if(!isPointOnCanvas(p5.mouseX, p5.mouseY)){
            console.warn('To use keyboard shortcuts, move pointer over drawing area');
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
        //console.log("drawPoint:"+JSON.stringify(p));
        //p5.stroke(p.pc[0], p.pc[1], p.pc[2], p.pc[3]);
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
        thisStroke.push(p);
        return true;
    }

    const setPointDrawn = (x, y) => {
            let p = getPointObj(x, y);
            if(drawPoint(p)){
                if(!isStroke){
                    //save and clear stroke
                    updateAnim({type: 'DO_STROKE', data: thisStroke});
                    thisStroke = [];   
                }
            }
            
            return isPointOnCanvas(x, y);
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
