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
        console.dir(props)
        if(props.anim 
        && p5 
        && props.anim.name !== 'nothing' 
        && props.collectionState 
        && (props.collectionState.index === props.index || props.index === 'temp')){
            previewAnimMobile(
                {
                    a: props.anim, 
                    p5canvas: p5canvas,
                    p5: p5, 
                    collectionItemDispatch: props.collectionItemDispatch, 
                    index: props.index, 
                    setCollectionState: props.setCollectionState
                }
            ).then(() => {
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
            });
        }else if(props.anim && props.anim !== 'nothing' && props.updateAnim){
            console.debug('preview: updateWithProps: props.anim -> previewAnim');
            previewAnim(
                {
                    a: props.anim,
                    type: props.type,
                    p5canvas: p5canvas,
                    p5: p5,
                    index: 'temp',
                    clip: false,
                    drawing: false,
                    updateAnim: props.updateAnim
                }
            )
        }
    }
    
    p5.draw = () => {

    }

    
    //p5.touchStarted = () => {return true;}
    //p5.touchMoved = () => {return true;}
    //p5.touchEnded = () => {return true;}


}
