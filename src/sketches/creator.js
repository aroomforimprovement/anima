import { ReactP5Wrapper } from 'react-p5-wrapper';


export const creator = (p5) => {
    p5.setup = () => {
        p5.createCanvas(600, 600);
        p5.fill(200);
    }
    p5.draw = () => {
        p5.background(0);
        p5.ellipse(p5.mouseX, p5.mouseY, 10, 10);
    }
}

