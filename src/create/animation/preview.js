import { previewAnim, previewAnimMobile } from './anim-util';
import { values } from '../values';
import { isMobile } from 'react-device-detect';

export const preview = (p5) => {
    let p5canvas = undefined;
    

    p5.setup = () => {
        p5canvas = p5.createCanvas(
            isMobile && p5.displayWidth < values.defaultSize ? p5.displayWidth : values.defaultSize, 
            isMobile && p5.displayWidth < values.defaultSize ? p5.displayWidth : values.defaultSize);
        p5.background(values.initialBgc[0], values.initialBgc[3]);
        p5.noStroke();
    }

    p5.updateWithProps = (props) => {
        if(props.anim && p5 && props.anim.name !== 'nothing' 
            && props.collectionState 
            && (props.collectionState.index === props.index 
                || props.index === 'temp')){
                //console.log(props.clip);
//            p5.resizeCanvas(
//                props.anim.size ? props.anim.size : values.defaultSize, 
//                props.anim.size ? props.anim.size : values.defaultSize);
            if(isMobile && props.clip){
                console.debug("isMobile + clip");
                previewAnimMobile(props.anim, p5canvas, p5, 
                    props.collectionItemDispatch, props.index, props.setCollectionState);
            }else{
                previewAnim(props.anim, props.type, p5canvas, p5, props.collectionItemDispatch, props.index, props.setCollectionState, props.clip);
            }
            
        }
    }
    
    p5.draw = () => {

    }

    p5.touchMoved = () => {
    }


}
