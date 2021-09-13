import React from 'react';
import { SITE } from '../../shared/site';

export const ControllerDropdown = ({title, classes, iSrc, btnList, disable, enable}) => {
    const c = `btn btn-sm btn-full-cond ${classes} dropdown-toggle`;
    return(
        <div className='btn-group dropdown' onmouseover={disable} onmouseout={enable} >
            <button className={c} title={title} type='button' data-toggle='dropdown' data-bs-toggle='dropdown' aria-expanded='false'>
                <img src={iSrc} alt={title} />
            </button>
            <ul class='dropdown-menu list-unstyled'>
                {btnList}
            </ul>
        </div>
    );
}

export const ControllerBtn = ({title, classes, func, disable, enable, iSrc, text}) => {
    const c = `btn btn-sm btn-ctl btn-full-cond ${classes}`;
    return(
        <div>
            <button className={c} title={title} 
                onClick={func} onmouseover={disable} onmouseout={enable}>
                <img src={iSrc} alt={title} />
                <span className='menu-text' ></span> {text}       
            </button>
        </div>
    );
}

export const ModeList = ({enable, disable}) => {

    return(
        <div>
            <li>
                <ControllerBtn 
                    title='SINGLE mode' classes='dropdown-item' 
                    func='setMode(CC.SINGLE)' enable={enable} disable={disable}
                    iSrc={SITE.icons.single} text='SINGLE'/>
            </li>
        </div>
    );
}

export const ModeDropdown = ({enable, disable}) => {
    const modeList = <ModeList enable={enable} disable={disable}/>
    return(
        <ControllerDropdown 
            title='Drawing Mode' classes='btn-outline-secondary'
            iSrc={SITE.icons.drawingMode}  btnList={modeList}/>
    );
}