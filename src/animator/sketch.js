import { values } from './values';
import { CC, CONTROLS }  from './controls';
import { initialCreateState } from './values';

export const sketch = (p5) => {
    let state = values.initialCreateState;
    let dispatch;
    /**
     *  P5
     */
    p5.setup = () => {
        p5.createCanvas(600, 600);
        p5.background(values.backgroundColour);
        state.pc = getPenColour(values.penWhite);
    }

    p5.updateWithProps = (props) => {
        state = props.create;
        dispatch = props.dispatch;
    }

    p5.draw = () => {
        
    }

    p5.mousePressed = () => {
        if(state.enabled){
            setPointDrawn(p5.mouseX, p5.mouseY);
        }else{
            console.log("DISABLED");
        }
    }
    p5.touchMoved = () => {
        console.log("STATE ENABLED: "+state.enabled);
        if(state.enabled){
            setPointDrawn(p5.mouseX, p5.mouseY);
        }else{
            console.log("DISABLED");
        }
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
        console.log("drawPoint:"+JSON.stringify(p));
        p5.stroke(p.pc);
        p5.fill(p.pc);
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
        }
        
    }

    const setPointDrawn = (x, y) => {
        if(isPointOnCanvas(x, y)){
            let p = getPointObj(x, y);
            //points push!;
            drawPoint(p);
        }else{
            console.log("point not on canvas");
        }
    }

    /**
     * 
     *  DRAWING OBJ UTILS 
     */
     const getPenColour = (arr) => {
        const c =  p5.color(arr[0], arr[1], arr[2], arr[3]);
        return c;
    }

    const getPointObj = (x, y) => {
        return {
            x : x,
            y : y,
            pc: state.pc.toString(),
            ps: state.ps,
            m: state.mode
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

}
