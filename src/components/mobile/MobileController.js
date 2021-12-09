import React, { useEffect, useReducer, useState } from 'react';
import { Button } from 'reactstrap';
import { CC, CONTROLS } from '../../animator/controls';
import { SITE } from '../../shared/site';
import { values } from '../../animator/values';
import { useControlContext } from '../Create';
import { Next, Undo, Redo } from '../partials/ControllerBtns';


const Expanse = () => {
    return(<div></div>);
}

const ControllerExpandedItem = ({title, func, iSrc, text, c}) => {
    const classes = `dropicon row ${c}`;
    return(
        <Button className={`btn-ctl m-1`} 
            title={title} onClick={func}>
            <img src={iSrc} alt={title} className={classes} />
            <small>{text}</small>
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

const PenSizeExpandable = ({closeExpandable}) => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        closeExpandable();
        dispatch({type: 'PS', data: val});
    }

    return(
        <div>
            <ControllerExpandedItem 
                title='Pen size 1' func={() => handle(CC.PS_1)}
                iSrc={SITE.icons.penSize} text='1'/>
            <ControllerExpandedItem 
                title='Pen size 2' func={() => handle(CC.PS_2)}
                iSrc={SITE.icons.penSize} text='2'/>
            <ControllerExpandedItem 
                title='Pen size 3' func={() => handle(CC.PS_3)}
                iSrc={SITE.icons.penSize} text='3'/>
            <ControllerExpandedItem 
                title='Pen size 4' func={() => handle(CC.PS_4)}
                iSrc={SITE.icons.penSize} text='4'/>
            <ControllerExpandedItem 
                title='Pen size 5' func={() => handle(CC.PS_5)}
                iSrc={SITE.icons.penSize} text='5'/>
            <ControllerExpandedItem 
                title='Pen size 6' func={() => handle(CC.PS_6)}
                iSrc={SITE.icons.penSize} text='6'/>
            <ControllerExpandedItem 
                title='Pen size 7' func={() => handle(CC.PS_7)}
                iSrc={SITE.icons.penSize} text='7'/>
        </div>
    );
}

const PenSize = ({func}) => {
    const { controls } = useControlContext();
    const [size, setSize] = useState(1);

    useEffect(() => {
        const handleSizeChange = () => {
            CONTROLS.forEach((controlObj) => {
                if(controlObj.t === CC.TYPE_SIZE){
                    if(controlObj.v === controls.ps){
                        setSize(parseInt(controlObj.n.substring(3, 4)));
                        return;
                    }
                }
            });
        }
        handleSizeChange();
    }, [controls.ps]);

    return(
        <Button className={`btn-ctl`} onClick={func}>
            <img src={SITE.icons.penSize} alt='Pen Size' />
            <div className='btn-caption'>{size}</div>
        </Button>
    );
}

const PenColourExpandable = () => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        dispatch({type: 'PC', data: val});
    }
    return(
        <div>
            <ControllerExpandedItem 
                title='BG Solid' func={() => handle(values.bg_solid)}
                iSrc={SITE.icons.penColour} c='black' text='BG Solid'/>
            <ControllerExpandedItem 
                title='BG Shade' func={() => handle(values.bg_shade)}
                iSrc={SITE.icons.penColour} c='black' text='BG Shade'/>
            <ControllerExpandedItem 
                title='FG Solid' func={() => handle(values.fg_solid)}
                iSrc={SITE.icons.penColour} c='white' text='FG Solid'/>
            <ControllerExpandedItem 
                title='FG Shade' func={() => handle(values.fg_shade)}
                iSrc={SITE.icons.penColour} c='white' text='FG Shade'/>
            <ControllerExpandedItem 
                title='Red' func={() => handle(values.red)}
                iSrc={SITE.icons.penColour} c='red' text='Red'/>
            <ControllerExpandedItem 
                title='Green' func={() => handle(values.green)}
                iSrc={SITE.icons.penColour} c='green' text='Green'/>
            <ControllerExpandedItem 
                title='Blue' func={() => handle(values.blue)}
                iSrc={SITE.icons.penColour} c='blue' text='Blue'/>
            <ControllerExpandedItem 
                title='Yellow' func={() => handle(values.yellow)}
                iSrc={SITE.icons.penColour} c='yellow' text='Yellow'/>
            <ControllerExpandedItem 
                title='Cyan' func={() => handle(values.cyan)}
                iSrc={SITE.icons.penColour} c='cyan' text='Cyan'/>
            <ControllerExpandedItem 
                title='Purple' func={() => handle(values.purple)}
                iSrc={SITE.icons.penColour} c='purple' text='Purple'/>
            <ControllerExpandedItem 
                title='Pink' func={() => handle(values.pink)}
                iSrc={SITE.icons.penColour} c='pink' text='Pink'/>
        </div>
    );
}

const PenColour = ({func}) => {
    return(
        <Button className={`btn-ctl`} onClick={func}> 
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
                return(<ModeExpandable closeExpandable={closeExpandable}/>);
            }
            case 'PenSize':{
                return(<PenSizeExpandable closeExpandable={closeExpandable}/>);
            }
            case 'PenColour':{
                return(<PenColourExpandable closeExpandable={closeExpandable}/>);
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
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <PenSize func={() => {dispatch({type: 'PenSize'})}}/>
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <PenColour func={() => {dispatch({type: 'PenColour'})}}/>
                </div>                
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <Undo />
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <Redo/>
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <FrameRate func={() => {dispatch({type: 'FrameRate'})}}/>
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <Background func={() => {dispatch({type: 'Background'})}}/>
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <Next/>
                </div> 
            </div>
            <div className='m-1'>{state}</div>
        </div>
    )
}