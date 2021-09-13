import { values } from './values';
import { CC, CONTROLS }  from './controls';


export const sketch = (p5) => {
    let pen = { pc: null, ps: 5, mode: 101 };
    
    /**
     *  P5
     */
    p5.setup = () => {
        p5.createCanvas(600, 600);
        p5.background(values.backgroundColour);
        pen.pc = getPenColour(values.penWhite);
    }
    p5.draw = () => {
        
    }

    p5.mousePressed = () => {
        setPointDrawn(p5.mouseX, p5.mouseY)
    }
    p5.touchMoved = () => {
        setPointDrawn(p5.mouseX, p5.mouseY);
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
            default:
                console.warn('key pressed but no shortcut exists for key ['+p5.key+']');
        }
    }

    /**
     * 
     * DRAWING ACTIONS 
     */

    const drawPoint = (p) => {
        console.log("pen.drawPoint:"+JSON.stringify(p));
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
            pc: pen.pc.toString(),
            ps: pen.ps,
            m: pen.mode
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
        pen.mode = controlObj.v;
    }

}

