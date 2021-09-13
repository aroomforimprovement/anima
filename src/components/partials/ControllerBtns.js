import React, { useContext, useState, useReducer } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { SITE } from '../../shared/site';
import { useCreateContext } from '../Create';
import { CC } from '../../animator/controls';


export const ControllerDropdownItem = ({title, classes, func, iSrc, text}) => {
    const c = `btn btn-sm btn-ctl btn-full-cond dropdown-item`;
    return(
        <DropdownItem className={c} title={title} 
            onClick={func} >
            <img src={iSrc} alt={title} />
            <span className='menu-text' ></span> {text}       
        </DropdownItem>
    );
}

export const ModeDropdown = () => {
    const { create, dispatch } = useCreateContext();
    const handle = (val) => {
        dispatch({ type: 'MODE', data: val });
    }
    
    return(
        <DropdownMenu>
                <ControllerDropdownItem 
                    title='SINGLE mode' func={() => handle(CC.SINGLE)}
                    iSrc={SITE.icons.single} text='SINGLE'/>
                <ControllerDropdownItem 
                    title='MIRROR mode' func={() => handle(CC.MIRROR)}
                    iSrc={SITE.icons.mirror} text='MIRROR'/>
                <ControllerDropdownItem 
                    title='LAKE mode' func={() => handle(CC.LAKE)}
                    iSrc={SITE.icons.lake} text='LAKE'/>
                <ControllerDropdownItem 
                    title='QUAD mode' func={() => handle(CC.QUAD)}
                    iSrc={SITE.icons.quad} text='QUAD'/>
                
                
                
        </DropdownMenu>        
    );
    
}


export const Mode = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);

    return(
        <Dropdown isOpen={isOpen} toggle={toggle}>
            <DropdownToggle >
                Mode
            </DropdownToggle>
            <ModeDropdown />
        </Dropdown>
    );
}
