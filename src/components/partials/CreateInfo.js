import React, { useEffect, useState } from 'react';
import { useControlContext } from '../Create'; 
import { CC } from '../../animator/controls';

export const CreateInfo = () => {
    
    const { controls } = useControlContext();
    const [mode, setMode] = useState(101);

    const getMode = () => {
        switch(controls.mode){
            case CC.SINGLE:
                return 'Single';
            case CC.MIRROR:
                return 'Mirror';
            case CC.LAKE:
                return 'Lake';
            case CC.QUAD:
                return 'QUAD';
                default:
                    return '?';
        }
    }
    useEffect(() => {
        setMode(getMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[controls.mode]);
    return(
        <div className='create-info container'>
            <p title='Current frame rate'>fR: {controls.frate}</p>
            <span>, </span>
            <p title='Current drawing mode'>Mode: {mode}</p>
        </div>

    );
}