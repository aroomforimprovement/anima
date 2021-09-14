import React from 'react';
import { sketch } from '../../animator/sketch';
import { Mode, PenColour, PenSize } from './ControllerBtns';

const Controller = ({create}) => {

    return(
        <div className='container controller justify-content-center' >
            <p>Control panel</p>
            <div className="row">
                <Mode  />
                <PenSize />
                <PenColour />
            </div>
        </div>
    );
}

export default Controller;