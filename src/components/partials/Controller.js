import React from 'react';
import { sketch } from '../../animator/sketch';
import { Mode, PenSize } from './ControllerBtns';

const Controller = ({create}) => {

    return(
        <div className='controller' >
            <p>Control panel</p>
            <Mode create={create} />
            <PenSize create={create} />
        </div>
    );
}

export default Controller;