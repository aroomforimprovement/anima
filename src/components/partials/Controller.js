import React from 'react';
import { Mode, PenColour, PenSize, Undo, Redo, FrameRate } from './ControllerBtns';

const Controller = ({create}) => {

    return(
        <div className='container controller justify-content-center' >
            <p>Control panel</p>
            <div className="row">
                <Mode />
                <PenSize />
                <PenColour />
                <Undo />
                <Redo />
                <FrameRate />
            </div>
        </div>
    );
}

export default Controller;