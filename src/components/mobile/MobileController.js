import React, { useState } from 'react';
import { CC } from '../../animator/controls';
import { SITE } from '../../shared/site';
import { useControlContext } from '../Create';
import { Next, Undo, Redo } from '../partials/ControllerBtns';

const ControllerExpandedItem = ({title, func, iSrc, text, c}) => {
    const classes = `dropicon ${c}`;
    return(
        <button className={`btn btn-sm dropicon`} 
            title={title} onClick={func}>
            <img src={iSrc} alt={title} className={classes} />
            <span></span> {text}
        </button>
    );
}

const ModeExpandable = () => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
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

const Mode = () => {
    return(
        <button className={`btn btn-sm dropicon`}>
            <img src={SITE.icons.drawingMode} alt='Drawing Mode' />
        </button>
    );
}

const PenSize = () => {
    return(
        <button className={`btn btn-sm dropicon`}>
            <img src={SITE.icons.penSize} alt='Pen Size' />
        </button>
    );
}

const PenColour = () => {
    return(
        <button className={`btn btn-sm dropicon`}>
            <img src={SITE.icons.penColour} alt='Pen Colour' />
        </button>
    );
}

const FrameRate = () => {
    return(
        <button className={`btn btn-sm dropicon`}>
            <img src={SITE.icons.frate} alt='Frame Rate' />
        </button>
    );
}

const Background = () => {
    return(
        <button className={`btn btn-sm dropicon`}>
            <img src={SITE.icons.bg} alt='Save / Set Background' />
        </button>
    );
}

const ExpandableArea = ({btns, expanded}) => {
    return(
        <div hidden={!expanded}>
            {btns}
        </div>
    );
}

export const MobileController = () => {

    const [isExpanded, setIsExpanded] = useState(false);
    
    return(
        <div className='container controller col-12'>
            <div className='row'>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><Mode /></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><PenSize /></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><PenColour /></div>                
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><Undo/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><Redo/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><FrameRate/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><Background/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-1 mx-md-2 mx-lg-2'><Next/></div> 
            </div>
            <ExpandableArea expanded={isExpanded} />
        </div>
    )
}