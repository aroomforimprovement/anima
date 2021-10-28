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
        if(props.anim && p5 && props.anim.name !== 'nothing' 
            && props.collectionState && props.collectionState.index === props.index){
                console.log(props.index);
            previewAnim(props.anim, p5canvas, p5, props.collectionItemDispatch, props.index, props.setCollectionState);
        }
    }
    
    p5.draw = () => {

    }




}
