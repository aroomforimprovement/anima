import React, { useEffect, useReducer, useState } from 'react';
import { Button } from 'reactstrap';
import { SITE } from '../../../shared/site';
import { values, CC, CONTROLS } from '../values';
import { useControlContext } from '../Create';
import { Next, Undo, Redo, Save, Download, Preview } from './ControllerBtns';
import toast from 'buttoned-toaster';


const Expanse = () => {
    return(<div></div>);
}

const ControllerExpandedItem = ({title, func, iSrc, text, c}) => {
    const classes = `dropicon row ${c}`;
    return(
        <Button className={`btn-ctl m-1`} 
            title={title} onClick={func}>
            <img src={iSrc} alt={title} className={classes} />
            <small>{isNaN(parseInt(text)) ? '' : text}</small>
        </Button>
    );
}

const ModeExpandable = ({closeExpandable}) => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        closeExpandable();
        updateControls({type: 'MODE', data: val});
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
    const { updateControls } = useControlContext();
    const handle = (val) => {
        closeExpandable();
        updateControls({type: 'PS', data: val});
    }

    const sizes = values.penSizes.map((size) => {
        return(
            <ControllerExpandedItem key={size}
                title={`Pen size ${size}`} func={() => handle(CC[`PS_${size}`])}
                iSrc={SITE.icons.penSize} text={size}/>
        );
    });

    return(
        <div>
            {sizes}
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

const PenColourExpandable = ({closeExpandable}) => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        closeExpandable();
        updateControls({type: 'PC', data: val});
    }
    return(
        <div>
            <ControllerExpandedItem 
                title='BG Solid' func={() => handle(values.bg_solid)}
                iSrc={SITE.icons.penColour} c='bg_solid' text='BG Solid'/>
            <ControllerExpandedItem 
                title='BG Shade' func={() => handle(values.bg_shade)}
                iSrc={SITE.icons.penColour} c='bg_shade' text='BG Shade'/>
            <ControllerExpandedItem 
                title='FG Solid' func={() => handle(values.fg_solid)}
                iSrc={SITE.icons.penColour} c='fg_solid' text='FG Solid'/>
            <ControllerExpandedItem 
                title='FG Shade' func={() => handle(values.fg_shade)}
                iSrc={SITE.icons.penColour} c='fg_shade' text='FG Shade'/>
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

const FrameRateExpandable = ({closeExpandable}) => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        closeExpandable();
        updateControls({type: 'FRAME_RATE', data: val});
    }

    const rates = values.frameRates.map((rate) => {
        return (
            <ControllerExpandedItem key={rate}
                title={`Frame rate ${rate}`} func={() => handle(rate)}
                iSrc={SITE.icons.penSize} text={rate}/>
        );
    });

    return(
        <div>
            {rates}
        </div>
    );
}

const FrameRate = ({func}) => {
    return(
        <Button className={`btn-ctl`} onClick={func}>
            <img src={SITE.icons.frate} alt='Frame Rate' />
        </Button>
    );
}

const BackgroundExpandable = ({closeExpandable}) => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        closeExpandable();
        updateControls({type: val, data: true});
    }
    return(
        <div>
            <ControllerExpandedItem 
                title='Save background' func={() => handle('SAVE_BG')}
                iSrc={SITE.icons.saveBg} text="Save this frame as background"/>
            <ControllerExpandedItem 
                title='Draw background' func={() => handle('DRAW_BG')}
                iSrc={SITE.icons.drawBg} text="Clear frame and draw saved background"/>
            <ControllerExpandedItem 
                title='Wipe frame' func={() => handle('WIPE')}
                iSrc={SITE.icons.wipe} text="Wipe frame (can't be undone!)"/>
        </div>
    );
}

const Background = ({func}) => {
    return(
        <Button className={`btn-ctl`} onClick={func}>
            <img src={SITE.icons.bg} title='Background' alt='Save / Set Background' />
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
                return(state ? null : <ModeExpandable closeExpandable={closeExpandable}/>);
            }
            case 'PenSize':{
                return(state ? null : <PenSizeExpandable closeExpandable={closeExpandable}/>);
            }
            case 'PenColour':{
                return(state ? null : <PenColourExpandable closeExpandable={closeExpandable}/>);
            }
            case 'FrameRate':{
                return(state ? null : <FrameRateExpandable closeExpandable={closeExpandable} />)
            }
            case 'Background':{
                return(state ? null : <BackgroundExpandable closeExpandable={closeExpandable} />)
            }
            case 'Close':{
                return(null)
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

const BgOverlayExpandable = ({closeExpandable, type}) => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        toast.success({message: `BG: ${val}`, duration: 1000});
        closeExpandable();
        updateControls({type: type, data: val});
    }
    return(
        <div>
            {values.bgOverlayVals.map((val, i) => {
                return(
                    <ControllerExpandedItem key={val}
                        title={`Background ${type === 'ADJUST_BG_FRAME' ? 'drawing' : 'overlay'} opacity: ${val}`}
                        func={() => handle(val)}
                        iSrc={type === 'ADJUST_BG_FRAME' ? SITE.icons.bgFrameOpacity : SITE.icons.bgOpacity}
                        text={val}
                    />
                )
            })}
        </div>
    )
}

const BgOverlayOpacity = ({func}) => {
    return(
        <Button className={'btn-ctl'} onClick={func}>
            <img 
                src={SITE.icons.bgOpacity} 
                title={'Background overlay opacity'}
                alt='Background overlay opacity' />
        </Button>
    )
}

const BgFrameOpacity = ({func}) => {
    return(
        <Button className='btn-ctl' onClick={func}>
            <img 
                src={SITE.icons.bgFrameOpacity} 
                title={'Background drawing opacity'}
                alt='Background drawing opacity' />
        </Button>
    )
}

export const MobileSaveController = () => {
    
    const closeExpandable = () => {
        dispatch({type: 'Close'});
    }

    const reducer = (state, action) => {
        switch(action.type){
            case 'BgOverlay':{
                return(state 
                    ? null 
                    : <BgOverlayExpandable 
                        closeExpandable={closeExpandable}
                        type='ADJUST_BG_OVERLAY'/>
                    );
            }
            case 'BgFrame':{
                return(state
                    ? null
                    : <BgOverlayExpandable
                        closeExpandable={closeExpandable} 
                        type='ADJUST_BG_FRAME'/>)
            }
            case 'Close':{
                return(null)
            }
            default:
                console.warn("No control matched");
                break;
        }
    }

    const [state, dispatch] = useReducer(reducer, <Expanse />);

    return(
        <div className='container controller col-12'>
            <div className='row'>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <Save/>
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <Download/>
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <Preview/>
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <BgOverlayOpacity
                        func={() => dispatch({type: 'BgOverlay'})} />
                </div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'>
                    <BgFrameOpacity
                        func={() => dispatch({type: 'BgOverlay'})} />
                </div>
            </div>
            <div className='m-1'>{state}</div>
        </div>
    )
}