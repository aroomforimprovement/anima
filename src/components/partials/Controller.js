import React from 'react';
import { Mode, PenColour, PenSize, Undo, Redo, FrameRate,
    Background, Next, Download, Save, Preview, EnableShortcuts } from './ControllerBtns';
import { CreateInfo } from './CreateInfo';


export const Controller = () => {

    return(
        <div className='container controller col-sm-12 col-md-6 col-lg-5 col-xl-4 my-1'>
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
        </div>
    );
}

export const SaveController = () => {
    return(
        <div className='container controller col-12 col-md-8 col-lg-8 col-xl-8 col-xxl-7 mt-1 mb-1'> 
            <div className='row'>
                    <div className='save-controller col col-sm-6 col-xl-7'>
                        <div className='col col-sm-3 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'><Save /></div>
                        <div className='col col-sm-3 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'><Download /></div>
                        <div className='col col-sm-3 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'><Preview /></div>
                </div>
                <div className='col col-6 col-md-5 col-lg-4 col-xl-3'>    
                    <div className='row'>
                    <div ><EnableShortcuts id='enable-shortcuts'/></div>
                    </div>
                    <div className='row'>
                        <CreateInfo />
                    </div>
                </div>
            </div>
        </div>
    );
}