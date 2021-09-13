import React from 'react';
import { sketch } from '../../animator/sketch';
import { ModeDropdown } from './ControllerBtns';

const Controller = () => {
    const disable = () => {console.warn("disable not implemented")};
    const enable = () => {console.warn("enable not implemented")};

    return(
        <div className='controller' >
            <p>Control panel</p>
            <ModeDropdown enable={enable} disable={disable}/>
        </div>
    );
}

export default Controller;