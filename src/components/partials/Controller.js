import React from 'react';
import { Mode, PenColour, PenSize, Undo, Redo, FrameRate,
    Background, Next, Download, Save, Preview, EnableShortcuts,
    Privacy } from './ControllerBtns';
import { ButtonGroup, Row, Col, ButtonToolbar } from 'reactstrap';

export const Controller = () => {

    return(
        <div className='container controller col-12 col-md-10 col-md-6 col-lg-5 col-xl-4 mt-1 mb-1'>
            <div className='row'>
                <div className='btn-ctl col-sm-1 m-2 m-lg-1'><Mode /></div>
                <div className='btn-ctl col-sm-1 m-2 m-lg-1'><PenSize /></div>
                <div className='btn-ctl col-sm-1 m-2 m-lg-1'><PenColour /></div>
                <div className='btn-ctl col-sm-1 m-2 m-lg-1'><Undo/></div>
                <div className='btn-ctl col-sm-1 m-2 m-lg-1'><Redo/></div>
                <div className='btn-ctl col-sm-1 m-2 m-lg-1'><FrameRate/></div>
                <div className='btn-ctl col-sm-1 m-2 m-lg-1'><Background/></div>
                <div className='btn-ctl col-sm-1 m-2 m-lg-1'><Next/></div>
            </div>
        </div>
    );
}

export const SaveController = () => {
    return(
        <div className='container controller col-12 col-md-6 col-lg-5 col-xl-4 mt-1 mb-1'> 
            <div className='row'>
                    <div className='col col-sm-6'>
                        <div className='col col-sm-3 col-lg-2 btn-ctl m-1'><Save /></div>
                        <div className='col col-sm-3 btn-ctl m-1'><Download /></div>
                        <div className='col col-sm-3 btn-ctl m-1'><Preview /></div>
                </div>
                <div className='col '>    
                    <div ><EnableShortcuts id='enable-shortcuts'/></div>
                </div>
            </div>
        </div>
    );
}