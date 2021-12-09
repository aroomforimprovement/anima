import React, { useReducer } from 'react';
import { Button } from 'reactstrap';
import { CC } from '../../animator/controls';
import { SITE } from '../../shared/site';
import { useControlContext } from '../Create';
import { Next, Undo, Redo } from '../partials/ControllerBtns';


const Expanse = () => {
    return(<div></div>);
}

const ControllerExpandedItem = ({title, func, iSrc, text, c}) => {
    const classes = `dropicon row ${c}`;
    return(
        <Button className={`btn-ctl`} 
            title={title} onClick={func}>
            <img src={iSrc} alt={title} className={classes} />
            <span></span> {text}
        </Button>
    );
}

const ModeExpandable = ({closeExpandable}) => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        closeExpandable();
        dispatch({type: 'MODE', data: val});
    }

    return(
        <div>
            <ControllerExpandedItem 
                title='SINGLE mode' func={() => handle(CC.SINGLE)}
                iSrc={SITE.icons.single} text='Single'/>
            <ControllerExpandedItem 
                title='MIRROR mode' func={() => handle(CC.MIRROR)}
                iSrc={SITE.icons.mirror} text='Mirror'/>
            <ControllerExpandedItem 
                title='LAKE mode' func={() => handle(CC.LAKE)}
                iSrc={SITE.icons.lake} text='Lake'/>
            <ControllerExpandedItem 
                title='QUAD mode' func={() => handle(CC.QUAD)}
                iSrc={SITE.icons.quad} text='Quad'/>
        </div>
    );
}

const Mode = ({func}) => {
    return(
        <Button type='button' className={`btn-ctl`} onClick={func}>
            <img src={SITE.icons.drawingMode} alt='Drawing Mode' />
        </Button>
    );
}

const PenSize = () => {
    return(
        <Button className={`btn-ctl`}>
            <img src={SITE.icons.penSize} alt='Pen Size' />
        </Button>
    );
}

const PenColour = () => {
    return(
        <Button className={`btn-ctl`}>
            <img src={SITE.icons.penColour} alt='Pen Colour' />
        </Button>
    );
}

const FrameRate = () => {
    return(
        <Button className={`btn-ctl`}>
            <img src={SITE.icons.frate} alt='Frame Rate' />
        </Button>
    );
}

const Background = () => {
    return(
        <Button className={`btn-ctl`}>
            <img src={SITE.icons.bg} alt='Save / Set Background' />
        </Button>
    );
}

export const MobileController = () => {

    const closeExpandable = () => {
        dispatch({type: 'Close'});
    }

    const reducer = (state, action) => {
        switch(action.type){
            case 'Mode':{
                console.log('reducer Mode');
                return(<ModeExpandable closeExpandable={closeExpandable}/>);
            }
            case 'Close':{
                return(<Expanse />)
            }
            default:
            break;
        }
    }

    const [state, dispatch] = useReducer(reducer, <Expanse />);

    
    return(
        <div className='container controller col-12'>
            <div className='row'>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <Mode func={() => {dispatch({type: 'Mode'})}}/>
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><PenSize /></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><PenColour /></div>                
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><Undo/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><Redo/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><FrameRate/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><Background/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><Next/></div> 
            </div>
            <div className='m-1'>{state}</div>
        </div>
    )
}