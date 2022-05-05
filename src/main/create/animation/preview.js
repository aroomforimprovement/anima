import { previewAnim, previewAnimMobile } from './anim-util';
import { values } from '../values';

export const preview = (p5) => {
    //temp switch to turn off thumbs on mobile, using video
    const isMobile = false;
    let p5canvas = undefined;

    p5.setup = () => {
        p5canvas = p5.createCanvas(
            isMobile && p5.displayWidth < values.defaultSize ? p5.displayWidth : values.defaultSize, 
            isMobile && p5.displayWidth < values.defaultSize ? p5.displayWidth : values.defaultSize);
        p5.background(values.initialBgc[0], values.initialBgc[3]);
        p5.noStroke();
        p5.noLoop();
    }

    p5.updateWithProps = (props) => {
        if(props.anim && p5 && props.anim.name !== 'nothing' 
            && props.collectionState 
            && (props.collectionState.index === props.index 
                || props.index === 'temp')){
                //console.log(props.clip);
                //p5.resizeCanvas(
                //props.anim.size ? props.anim.size : values.defaultSize, 
                //props.anim.size ? props.anim.size : values.defaultSize);
            if(isMobile && props.clip){
                //console.debug("isMobile + clip");
                previewAnimMobile(
                    {
                        a: props.anim, 
                        p5canvas: p5canvas,
                        p5: p5, 
                        collectionItemDispatch: props.collectionItemDispatch, 
                        index: props.index, 
                        setCollectionState: props.setCollectionState
                    }
                );
            }else{
                previewAnim(
                    {
                        a: props.anim, 
                        type: props.type, 
                        p5canvas: p5canvas,
                        p5: p5, 
                        collectionItemDispatch: props.collectionItemDispatch, 
                        index: props.index, 
                        setCollectionState: props.setCollectionState, 
                        clip: props.clip,
                        drawing: false,
                        mainDispatch: props.mainDispatch
                    }
                );
            }
            
        }
    }
    
    p5.draw = () => {

    }

    
    //p5.touchStarted = () => {return true;}
    //p5.touchMoved = () => {return true;}
    //p5.touchEnded = () => {return true;}


}
