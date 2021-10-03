import { previewAnim } from './anim-util';
import { values } from './values';

export const preview = (p5) => {
    let p5canvas = undefined;
    

    p5.setup = () => {
        p5canvas = p5.createCanvas(600, 600);
        p5.background(values.initialBgc[0], values.initialBgc[3]);
        p5.noStroke();
    }

    p5.updateWithProps = (props) => {
        console.log("updateWithProps");
        console.dir(props);
        if(props.anim && p5 && props.anim.name !== 'nothing'){
            console.log("calling previewAnim");
            previewAnim(props.anim, p5canvas, p5, props.collectionItemDispatch);
        }
    }
    
    p5.draw = () => {

    }




}
