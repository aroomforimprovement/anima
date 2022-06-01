import React, { useEffect, useState } from 'react';
import { useControlContext } from '../Create'; 
import { CC, values } from '../values';
import { SITE } from '../../../shared/site';
import toast from 'buttoned-toaster';

export const ControllerInfo = () => {
    
    const { controls } = useControlContext();
    const [mode, setMode] = useState(101);
    const [colour, setColour] = useState('black');
    
    useEffect(() => {
        const getMode = () => {
            let mode = '';
            switch(controls.mode){
                case CC.SINGLE:
                    mode = 'Single';
                    break
                case CC.MIRROR:
                    mode = 'Mirror';
                    break;
                case CC.LAKE:
                    mode = 'Lake';
                    break;
                case CC.QUAD:
                    mode = 'QUAD';
                    break;
                    default:
                        mode = '?';
            }
            toast.success({message: mode, duration:1000});
            return mode;
        }
        setMode(getMode);
    },[controls.mode]);

    useEffect(() => {
        const handleColourChange = () => {
            let colour = 'white';
            switch(controls.pc){
                case values.red:{
                    colour = 'red'; 
                    break;
                }
                case values.green: {
                    colour = 'green';
                    break;
                }
                case values.blue: {
                    colour = 'blue'; 
                    break;
                }
                case values.yellow: {
                    colour = 'yellow'; 
                    break;
                }
                case values.orange: {
                    colour = 'orange'; 
                    break;
                }
                case values.cyan: {
                    colour = 'cyan'; 
                    break;
                }
                case values.purple: {
                    colour = 'purple'; 
                    break;
                }
                case values.pink: {
                    colour = 'pink'; 
                    break;
                }
                case values.bg_solid:
                case values.bg_shade:{ 
                    colour = 'black';
                    break;
                }
                case values.fg_solid: 
                case values.fg_shade:{ 
                    colour = 'white';
                    break;
                }
                default:
                    break;
            }
            setColour(colour);
        }
        handleColourChange();
    }, [controls.pc])

    return(
        <div className='create-info container'>
            <span title='Current frame rate'>fR: {controls.frate}</span>
            <span>, </span>
            <span title='Current drawing mode'>Mode: {mode}</span>
            <span>, </span><br/>
            <span title='Current pen size'>Pen size: {controls.ps}</span>
            <span>, </span>
            <span title='Current pen size' style={{colour: colour}}>Pen colour: {colour}</span>
        </div>
    );
}

export const ShortcutInfo = () => {
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