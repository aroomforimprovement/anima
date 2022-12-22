import React, {useState} from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { MobileController, MobileSaveController } from './MobileController';
import { Mode, PenColour, PenSize, Undo, Redo, FrameRate,
    Background, Next, Download, Save, Preview, EnableShortcuts, AdjustBg, AdjustBgFrame, Layer, Send } from './ControllerBtns';
import { ControllerInfo } from './ControllerInfo';
import './controller.scss';


export const Controller = ({isMessage}) => {
    return(
        <div>
            <BrowserView>
                <div className='container controller my-1 mx-auto'>
                    <div className='row'>
                        <div className='btn-ctl col-1 col-sm-1 mx-auto'><Mode /></div>
                        <div className='btn-ctl col-1 col-sm-1 mx-auto'><PenSize /></div>
                        <div className='btn-ctl col-1 col-sm-1 mx-auto'><PenColour /></div>
                        <div className='btn-ctl col-1 col-sm-1 mx-auto'><Undo/></div>
                        <div className='btn-ctl col-1 col-sm-1 mx-auto'><Redo/></div>
                        <div className='btn-ctl col-1 col-sm-1 mx-auto'><FrameRate/></div>
                        <div className='btn-ctl col-1 col-sm-1 mx-auto'><Background/></div>
                        <div className='btn-ctl col-1 col-sm-1 mx-auto'><Next/></div>
                    </div>
                </div>
            </BrowserView>
            <MobileView>
                <MobileController />
            </MobileView>
        </div>
    );
}

export const SaveController = ({isMessage}) => {
    
    return(
        <div>
            <div className='container controller col-12 col-md-8 col-lg-8 col-xl-8 col-xxl-7 mt-1 mb-1'> 
            <BrowserView>
                <div className='row'>
                    <div className={isMessage ? 'save-controller row' : 'save-controller col col-sm-6 col-xl-7' }>
                        <div className={isMessage ? 'col mx-auto' : 'col col-sm-2 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'}>{isMessage ? <Send /> : <Save />}</div>
                        <div className={isMessage ? 'col mx-auto' : 'col col-sm-2 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'}><Download /></div>
                        <div className={isMessage ? 'col mx-auto' : 'col col-sm-2 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'}><Preview /></div>
                        <div className={isMessage ? 'col mx-auto' : 'col col-sm-2 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'}><AdjustBg /></div>
                        <div className={isMessage ? 'col mx-auto' : 'col col-sm-2 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'}><AdjustBgFrame/></div>
                        <div className={isMessage ? 'col mx-auto' : 'col col-sm-2 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'}><Layer/></div>
                        {/*<div className='col col-sm-2 col-md-3 col-lg-2 col-xl-1 btn-ctl m-2 mx-xs-0'><Record /></div>*/}
                    </div>
                        <div className={isMessage ? 'row' : 'col col-6 col-md-5 col-lg-4 col-xl-3'}>    
                        <div className='row'>
                            <div ><EnableShortcuts id='enable-shortcuts'/></div>
                        </div>
                        <div className='row'>
                            <ControllerInfo />
                        </div>
                    </div>                    
                </div>
                </BrowserView>
                <MobileView>
                    <MobileSaveController />
                    <ControllerInfo />
                </MobileView>
            </div>
        </div>
    );
}
