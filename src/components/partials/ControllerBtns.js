import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { SITE } from '../../shared/site';
import { values } from '../../animator/values';
import { useControlContext } from '../Create';
import { CC } from '../../animator/controls';


const ControllerDropdownItem = ({title, classes, func, iSrc, text}) => {
    const c = `btn btn-sm`;
    return(
        <DropdownItem className={c} title={title} 
            onClick={func} >
            <img src={iSrc} alt={title} />
            <span className='menu-text' ></span> {text}       
        </DropdownItem>
    );
}

const ModeDropdown = () => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        dispatch({ type: 'MODE', data: val });
        dispatch({ type: 'ENABLE' });
    }
    
    return(
        <DropdownMenu onMouseOver={() => dispatch({type: 'DISABLE'})} onMouseOut={() => dispatch({type: 'ENABLE'})}>
                <ControllerDropdownItem 
                    title='SINGLE mode' func={() => handle(CC.SINGLE)}
                    iSrc={SITE.icons.single} text='Single'/>
                <ControllerDropdownItem 
                    title='MIRROR mode' func={() => handle(CC.MIRROR)}
                    iSrc={SITE.icons.mirror} text='Mirror'/>
                <ControllerDropdownItem 
                    title='LAKE mode' func={() => handle(CC.LAKE)}
                    iSrc={SITE.icons.lake} text='Lake'/>
                <ControllerDropdownItem 
                    title='QUAD mode' func={() => handle(CC.QUAD)}
                    iSrc={SITE.icons.quad} text='Quad'/>
        </DropdownMenu>        
    );
}

export const Mode = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);
    return(
        <Dropdown isOpen={isOpen} toggle={toggle} >
            <DropdownToggle className='btn btn-sm btn-outline-secondary col-1'>
                <img src={SITE.icons.drawingMode} alt='Drawing Mode'/>
            </DropdownToggle>
            <ModeDropdown />
        </Dropdown>
    );
}

const PenSizeDropdown = () => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        dispatch({ type: 'PS', data: val});
        dispatch({ type: 'ENABLE' });
    }
    return(
        <DropdownMenu onMouseOver={() => dispatch({type: 'DISABLE'})} onMouseOut={() => dispatch({type: 'ENABLE'})}>
                <ControllerDropdownItem 
                    title='Pen size 1' func={() => handle(CC.PS_1)}
                    iSrc={SITE.icons.penSize} text='1'/>
                <ControllerDropdownItem 
                    title='Pen size 2' func={() => handle(CC.PS_2)}
                    iSrc={SITE.icons.penSize} text='2'/>
                <ControllerDropdownItem 
                    title='Pen size 3' func={() => handle(CC.PS_3)}
                    iSrc={SITE.icons.penSize} text='3'/>
                <ControllerDropdownItem 
                    title='Pen size 4' func={() => handle(CC.PS_4)}
                    iSrc={SITE.icons.penSize} text='4'/>
                <ControllerDropdownItem 
                    title='Pen size 5' func={() => handle(CC.PS_5)}
                    iSrc={SITE.icons.penSize} text='5'/>
                <ControllerDropdownItem 
                    title='Pen size 6' func={() => handle(CC.PS_6)}
                    iSrc={SITE.icons.penSize} text='6'/>
                <ControllerDropdownItem 
                    title='Pen size 7' func={() => handle(CC.PS_7)}
                    iSrc={SITE.icons.penSize} text='7'/>
        </DropdownMenu>  
    );

}

export const PenSize = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);
    return(
        <Dropdown isOpen={isOpen} toggle={toggle}>
            <DropdownToggle className='btn btn-outline-secondary col-1 btn-sm'>
                <img src={SITE.icons.penSize} alt='Pen size'/>
            </DropdownToggle>
            <PenSizeDropdown />
        </Dropdown>
    );
}

const PenColourDropdown = () => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        dispatch({ type: 'PC', data: val});
        dispatch({ type: 'ENABLE' });
    }
    return(
        <DropdownMenu onMouseOver={() => dispatch({type: 'DISABLE'})} onMouseOut={() => dispatch({type: 'ENABLE'})}>
            <ControllerDropdownItem 
                title='BG Solid' func={() => handle(values.bg_solid)}
                iSrc={SITE.icons.penColour} text='BG Solid'/>
            <ControllerDropdownItem 
                title='BG Shade' func={() => handle(values.bg_shade)}
                iSrc={SITE.icons.penColour} text='BG Shade'/>
            <ControllerDropdownItem 
                title='FG Solid' func={() => handle(values.fg_solid)}
                iSrc={SITE.icons.penColour} text='FG Solid'/>
            <ControllerDropdownItem 
                title='FG Shade' func={() => handle(values.fg_shade)}
                iSrc={SITE.icons.penColour} text='FG Shade'/>
            <ControllerDropdownItem 
                title='Red' func={() => handle(values.red)}
                iSrc={SITE.icons.penColour} text='Red'/>
            <ControllerDropdownItem 
                title='Green' func={() => handle(values.green)}
                iSrc={SITE.icons.penColour} text='Green'/>
            <ControllerDropdownItem 
                title='Blue' func={() => handle(values.blue)}
                iSrc={SITE.icons.penColour} text='Blue'/>
            <ControllerDropdownItem 
                title='Yellow' func={() => handle(values.yellow)}
                iSrc={SITE.icons.penColour} text='Yellow'/>
            <ControllerDropdownItem 
                title='Cyan' func={() => handle(values.cyan)}
                iSrc={SITE.icons.penColour} text='Cyan'/>
            <ControllerDropdownItem 
                title='Purple' func={() => handle(values.purple)}
                iSrc={SITE.icons.penColour} text='Purple'/>
            <ControllerDropdownItem 
                title='Pink' func={() => handle(values.pink)}
                iSrc={SITE.icons.penColour} text='Pink'/>
        </DropdownMenu>  
    );
}

export const PenColour = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);
    return(
        <Dropdown isOpen={isOpen} toggle={toggle}>
            <DropdownToggle className='btn btn-outline-secondary btn-sm'>
                <img src={SITE.icons.penColour} alt='Pen size'/>
            </DropdownToggle>
            <PenColourDropdown />
        </Dropdown>
    );
}

const ControllerBtn = ({dispatchType, btnText, icon}) =>{
    const { dispatch } = useControlContext();
    const handle = () => {
        dispatch({type: dispatchType, data: true});
    }
    return(
        <div >
            <button type='button' className='btn btn-outline-secondary col-1 btn-sm' 
                title={btnText} onClick={() => handle()}>
                <img src={icon} alt={btnText} />
            </button>
        </div>
    );

}

export const Undo = () => {
    return(
        <ControllerBtn dispatchType='UNDO' 
            btnText={'Undo'} icon={SITE.icons.undo}/>
    );
}

export const Redo = () => {
    return(
        <ControllerBtn dispatchType='REDO' 
            btnText={'Redo'} icon={SITE.icons.redo}/>
    );
}