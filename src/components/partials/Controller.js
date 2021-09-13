import React from 'react';
import { sketch } from '../../animator/sketch';
import { Mode } from './ControllerBtns';

const Controller = ({create}) => {
    const disable = () => {console.warn("disable not implemented")};
    const enable = () => {console.warn("enable not implemented")};

    return(
        <div className='controller' >
            <p>Control panel</p>
            <Mode create={create} //enable={enable} disable={disable}/>
            />
        </div>
    );
}

export default Controller;