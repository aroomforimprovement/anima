import React, { useEffect, useState } from 'react';
import { useControlContext } from '../Create'; 
import { CC } from '../../animator/controls';
import { SITE } from '../../shared/site';

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

export const ShortcutInfo = () => {
    //styling the reactstrap modal doesn't seem to do anything :(
    const list = SITE.shortcuts.map((obj, i) => {
        return(
            <div className='container shortcut-info-item'>
                <li key={obj.key} className='row'>
                    <p className='col col-2'>{obj.key}</p>
                    <p className='col col-2'>=</p>
                    <p className='col col-8'>{obj.text}</p>
                </li>
            </div>
        );
    });
    return(
        <ul className='list-unstyled'>
            {list}
        </ul>
    );
    
}