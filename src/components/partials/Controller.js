import React from 'react';
import { Mode, PenColour, PenSize, Undo, Redo, FrameRate,
    Background, Next, Download, Save, Preview, EnableShortcuts,
    Privacy } from './ControllerBtns';
import { ButtonGroup, Row, Col, ButtonToolbar } from 'reactstrap';

export const Controller = () => {

    return(
        <div className='container controller col-sm-12 col-md-10 col-md-6 col-lg-5 col-xl-4 my-1'>
            <div className='row'>
                <div className='btn-ctl col-1 col-sm-1 mx-2 mx-lg-2'><Mode /></div>
                <div className='btn-ctl col-1 col-sm-1 mx-2 mx-lg-2'><PenSize /></div>
                <div className='btn-ctl col-1 col-sm-1 mx-2 mx-lg-2'><PenColour /></div>
                <div className='btn-ctl col-1 col-sm-1 mx-2 mx-lg-2'><Undo/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-2 mx-lg-2'><Redo/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-2 mx-lg-2'><FrameRate/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-2 mx-lg-2'><Background/></div>
                <div className='btn-ctl col-1 col-sm-1 mx-2 mx-lg-2'><Next/></div>
            </div>
        </div>
    );
}

export const SaveController = () => {
    return(
        <div className='container controller col-12 col-md-8 col-lg-8 col-xl-8 mt-1 mb-1'> 
            <div className='row'>
                    <div className='save-controller col col-sm-6'>
                        <div className='col col-sm-3 col-md-3 col-lg-2 btn-ctl m-2'><Save /></div>
                        <div className='col col-sm-3 col-md-3 col-lg-2 btn-ctl m-2'><Download /></div>
                        <div className='col col-sm-3 col-md-3 col-lg-2 btn-ctl m-2'><Preview /></div>
                </div>
                <div className='col '>    
                    <div ><EnableShortcuts id='enable-shortcuts'/></div>
                </div>
            </div>
        </div>
    );
}