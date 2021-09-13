import { values } from './values';

export const sketch = (p5) => {
    let pen = {
        pc: null,
        ps: 5,
        mode: 101
    }
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

    const drawPoint = (point) => {
        console.log("pen.drawPoint:"+point);
        p5.stroke(point.pc);
        p5.ellipse(point.x, point.y, point.ps, point.ps);
    }

    const getPenColour = (arr) => {
        const c =  p5.color(arr[0], arr[1], arr[2], arr[3]);
        return c;
    }

    const setPointDrawn = (x, y) => {
        let p = getPointObj(x, y);
        //module.exports.points[];
        drawPoint(p);
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
}

