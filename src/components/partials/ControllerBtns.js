import React, { useContext, useState, useReducer } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { SITE } from '../../shared/site';
import { useCreateContext } from '../Create';
import { CC, CONTROLS } from '../../animator/controls';


const ControllerDropdownItem = ({title, classes, func, iSrc, text}) => {
    const c = `btn btn-sm btn-ctl btn-full-cond dropdown-item`;
    return(
        <DropdownItem className={c} title={title} 
            onClick={func} >
            <img src={iSrc} alt={title} />
            <span className='menu-text' ></span> {text}       
        </DropdownItem>
    );
}

const ModeDropdown = () => {
    const { dispatch } = useCreateContext();
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
            <DropdownToggle className='btn btn-sm btn-outline-secondary btn-lg'>
                <img src={SITE.icons.drawingMode} alt='Drawing Mode'/>
            </DropdownToggle>
            <ModeDropdown />
        </Dropdown>
    );
}

const PenSizeDropdown = () => {
    const { dispatch } = useCreateContext();
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
            <DropdownToggle className='btn btn-sm btn-outline-secondary btn-lg'>
                <img src={SITE.icons.penSize} alt='Pen size'/>
            </DropdownToggle>
            <PenSizeDropdown />
        </Dropdown>
    );
}
