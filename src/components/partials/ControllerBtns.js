import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
    FormGroup, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { SITE } from '../../shared/site';
import { values } from '../../animator/values';
import { useControlContext } from '../Create';
import { CC, CONTROLS } from '../../animator/controls';
import { ShortcutInfo } from './CreateInfo';


const ControllerDropdownItem = ({title, func, iSrc, text, c}) => {
    const classes = `dropicon ${c}`;
    return(
        <DropdownItem title={title} 
            onClick={func} >
            <img src={iSrc} alt={title} className={classes}/>
            <span ></span> {text}       
        </DropdownItem>
    );
}

const ModeDropdown = () => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        dispatch({ type: 'MODE', data: val });
        dispatch({ type: 'ENABLE', data: true });
    }
    
    return(
        <DropdownMenu onMouseOver={() => dispatch({type: 'DISABLE', data: true})} onMouseOut={() => dispatch({type: 'ENABLE', data: true})}>
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
        <Dropdown isOpen={isOpen} toggle={toggle}>
            <DropdownToggle >
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
        dispatch({ type: 'ENABLE', data: true });
    }
    return(
        <DropdownMenu onMouseOver={() => dispatch({type: 'DISABLE', data: true})} onMouseOut={() => dispatch({type: 'ENABLE', data: true})}>
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
    const { controls } = useControlContext();
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);
    const [size, setSize] = useState(1);

    //pretty hacky - would need to reorganise the CONTROLS object
    const handleSizeChange = () => {
        CONTROLS.forEach((controlObj) => {
            if(controlObj.t === CC.TYPE_SIZE){
                if(controlObj.v === controls.ps){
                    setSize(parseInt(controlObj.n.substring(3,4)));
                    return;
                }
            }
        });
    }

    useEffect(() => {
        handleSizeChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[controls.ps]);

    return(
        <Dropdown isOpen={isOpen} toggle={toggle} >
            <div className='btn-container'>
                <DropdownToggle >
                    <img src={SITE.icons.penSize} alt='Pen size'/>              
                </DropdownToggle>
            </div>
            <div className='btn-caption'>{size}</div>
            <PenSizeDropdown />
        </Dropdown>
    );
}

const PenColourDropdown = () => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        dispatch({ type: 'PC', data: val});
        dispatch({ type: 'ENABLE', data: true });
    }
    return(
        <DropdownMenu onMouseOver={() => dispatch({type: 'DISABLE', data: true})} onMouseOut={() => dispatch({type: 'ENABLE', data: true})}>
            <ControllerDropdownItem 
                title='BG Solid' func={() => handle(values.bg_solid)}
                iSrc={SITE.icons.penColour} c='black' text='BG Solid'/>
            <ControllerDropdownItem 
                title='BG Shade' func={() => handle(values.bg_shade)}
                iSrc={SITE.icons.penColour} c='black' text='BG Shade'/>
            <ControllerDropdownItem 
                title='FG Solid' func={() => handle(values.fg_solid)}
                iSrc={SITE.icons.penColour} c='white' text='FG Solid'/>
            <ControllerDropdownItem 
                title='FG Shade' func={() => handle(values.fg_shade)}
                iSrc={SITE.icons.penColour} c='white' text='FG Shade'/>
            <ControllerDropdownItem 
                title='Red' func={() => handle(values.red)}
                iSrc={SITE.icons.penColour} c='red' text='Red'/>
            <ControllerDropdownItem 
                title='Green' func={() => handle(values.green)}
                iSrc={SITE.icons.penColour} c='green' text='Green'/>
            <ControllerDropdownItem 
                title='Blue' func={() => handle(values.blue)}
                iSrc={SITE.icons.penColour} c='blue' text='Blue'/>
            <ControllerDropdownItem 
                title='Yellow' func={() => handle(values.yellow)}
                iSrc={SITE.icons.penColour} c='yellow' text='Yellow'/>
            <ControllerDropdownItem 
                title='Cyan' func={() => handle(values.cyan)}
                iSrc={SITE.icons.penColour} c='cyan' text='Cyan'/>
            <ControllerDropdownItem 
                title='Purple' func={() => handle(values.purple)}
                iSrc={SITE.icons.penColour} c='purple' text='Purple'/>
            <ControllerDropdownItem 
                title='Pink' func={() => handle(values.pink)}
                iSrc={SITE.icons.penColour} c='pink' text='Pink'/>
        </DropdownMenu>  
    );
}
 
export const PenColour = () => {
    const { controls } = useControlContext();
    const [isOpen, setIsOpen] = useState(false);
    const [colour, setColour] = useState(null)

    const toggle = () => setIsOpen(prevState => !prevState);
    
    const classes = `btn-colour-caption ${colour}`;
    //const classes = `btn-colour-caption`
    //console.log(classes);

    useEffect(() => {
        const handleColourChange = () => {
            //console.log('handleColorChange');
            switch(controls.pc){
                case values.red: setColour('red'); break;
                case values.green: setColour('green'); break;
                case values.blue: setColour('blue'); break;
                case values.yellow: setColour('yellow'); break;
                case values.orange: setColour('orange'); break;
                case values.cyan: setColour('cyan'); break;
                case values.purple: setColour('purple'); break;
                case values.pink: setColour('pink'); break;
                case values.bg_solid:
                case values.bg_shade: 
                    setColour('black');
                        break;
                case values.fg_solid: 
                case values.fg_shade: 
                    setColour('white');
                        break;
                default:
                    //console.log('no match');
                    break;
            }
        }
        //console.log("useEffect: handleColourChange " + controls.pc);
        handleColourChange();
    },[controls.pc]);
    
    
    return(
        <Dropdown isOpen={isOpen} toggle={toggle} >
            <div className='btn-colour-container'>
                <DropdownToggle >
                    <img src={SITE.icons.penColour} alt='Pen size'/>
                </DropdownToggle>
                <div className={classes} ></div>
            </div>
            <PenColourDropdown />
        </Dropdown>
    );
}

const FrameRateDropdown = () => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        dispatch({ type: 'FRAME_RATE', data: val});
        dispatch({ type: 'ENABLE', data: true });
    }
    return(
        <DropdownMenu onMouseOver={() => dispatch({type: 'DISABLE', data: true})} onMouseOut={() => dispatch({type: 'ENABLE', data: true})}>
                <ControllerDropdownItem 
                    title='Frame rate 4' func={() => handle(4)}
                    iSrc={SITE.icons.penSize} text='4'/>
                <ControllerDropdownItem 
                    title='Frame rate 8' func={() => handle(8)}
                    iSrc={SITE.icons.penSize} text='8'/>
                <ControllerDropdownItem 
                    title='Frame rate 12' func={() => handle(12)}
                    iSrc={SITE.icons.penSize} text='12'/>
                <ControllerDropdownItem 
                    title='Frame rate 16' func={() => handle(16)}
                    iSrc={SITE.icons.penSize} text='16'/>
                <ControllerDropdownItem 
                    title='Frame rate 20' func={() => handle(20)}
                    iSrc={SITE.icons.penSize} text='20'/>
                <ControllerDropdownItem 
                    title='Frame rate 24' func={() => handle(24)}
                    iSrc={SITE.icons.penSize} text='24'/>
                <ControllerDropdownItem 
                    title='Frame rate 28' func={() => handle(28)}
                    iSrc={SITE.icons.penSize} text='28'/>
        </DropdownMenu>  
    );

}

export const FrameRate = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);
    return(
        <Dropdown isOpen={isOpen} toggle={toggle} >
            <DropdownToggle >
                <img src={SITE.icons.frate} alt='Frame rate'/>
            </DropdownToggle>
            <FrameRateDropdown />
        </Dropdown>
    );
}

export const BackgroundDropdown = () => {
    const { dispatch } = useControlContext();
    const handle = (val) => {
        dispatch({type: val, data: true});
        dispatch({type: 'ENABLE', data: true});
    }
    return(
        <DropdownMenu onMouseOver={() => dispatch({type: 'DISABLE', data: true})} onMouseOut={() => dispatch({type: 'ENABLE', data: true})}>
            <ControllerDropdownItem 
                title='Save background' func={() => handle('SAVE_BG')}
                iSrc={SITE.icons.saveBg} text="Save this frame as background"/>
            <ControllerDropdownItem 
                title='Draw background' func={() => handle('DRAW_BG')}
                iSrc={SITE.icons.drawBg} text="Clear frame and draw saved background"/>
            <ControllerDropdownItem 
                title='Wipe frame' func={() => handle('WIPE')}
                iSrc={SITE.icons.wipe} text="Wipe frame (can't be undone!)"/>
        </DropdownMenu>
    );
}

export const Background = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);
    return(
        <Dropdown isOpen={isOpen} toggle={toggle} >
            <DropdownToggle >
                <img src={SITE.icons.bg} alt='Background'/>
            </DropdownToggle>
            <BackgroundDropdown />
        </Dropdown>
    ); 
}

const ControllerBtn = ({ dispatchType, btnText, icon }) =>{
    const { dispatch } = useControlContext();
    const handle = () => {
        dispatch({type: dispatchType, data: true});
    }
    return(
        <div>
            <Button type='button'
                title={btnText} onClick={() => handle()}>
                <img src={icon} alt={btnText} />
            </Button>
        </div>
    );

}

export const Undo = () => {
    return(
        <ControllerBtn dispatchType='UNDO' 
            btnText={'Undo stroke'} icon={SITE.icons.undo}/>
    );
}

export const Redo = () => {
    return(
        <ControllerBtn dispatchType='REDO' 
            btnText={'Redo stroke'} icon={SITE.icons.redo}/>
    );
}

export const Next = () => {
    return(
        <ControllerBtn dispatchType='NEXT'
            btnText={'Next frame'} icon={SITE.icons.next} />
    );
}

export const Download = () => {
    return(
        <ControllerBtn dispatchType='DOWNLOAD'
            btnText={'Download as gif'} icon={SITE.icons.download} />
    );
}

export const Save = () => {
    return(
        <ControllerBtn dispatchType='SAVE'
            btnText={'Save to account'} icon={SITE.icons.save} />
    );
}

export const Preview = () => {
    return(
        <ControllerBtn dispatchType='PREVIEW'
            btnText={'Preview animation'} icon={SITE.icons.preview} />
    )
}

export const EnableShortcuts = () => {

    const { dispatch } = useControlContext();
    const [isOpen, setIsOpen] = useState(false);

    const handleCheck = (e) => {
        dispatch({type: 'ENABLE_SHORTCUTS', data: e.target.checked});
    }
    return(
        <div className='shortcuts-group'>
            <form >
                <input type='checkbox' onChange={handleCheck}/>{' '} 
                <label className='shortcuts-label'>
                    Enable keyboard shortcuts (<span type='button' 
                        className='fa fa-question-circle' 
                        onClick={() => setIsOpen(true)}></span>)
                </label>
                <Modal isOpen={isOpen} className='shortcut-info'>
                    <ModalHeader>
                        <p>
                            With shortcuts enabled, you can trigger the following controls
                            with the following keys:
                        </p>
                        <p className='warn'>Only enabled while the cursor is over the drawing area.</p>
                        <p className='warn'>The pen colour icon doesn't change colour when using shortcuts.</p>
                    </ModalHeader>
                    <ModalBody>
                        <ShortcutInfo/>
                    </ModalBody>
                    <ModalFooter><Button onClick={() => setIsOpen(false)}>Close</Button></ModalFooter>
                </Modal>            
            </form>
        </div>
    );
}

export const Privacy = () => {
    const { controls, dispatch } = useControlContext();
    const [ checked, setChecked ] = useState(controls.currentPrivacy);
    const handleChange = (e) => {
        setChecked(e.target.value);
        dispatch({type: 'PRIVACY', data: parseInt(e.target.value)});
    }
    return(
        <div className='col col-xs-4 col-sm-7 ms-xs-1 ms-sm-2'>
        <FormGroup tag='fieldset' >
            <div className='row privacy-group'>
                <FormGroup check className='col'>
                    <Label check className='privacy-label'>
                        <Input type='radio' name='setPrivacy' value='0' 
                            // eslint-disable-next-line eqeqeq
                            checked={checked == 0}
                            onChange={handleChange}/>{' '}
                        <span >Public</span>
                    </Label>
                </FormGroup >
                <FormGroup check className='col'>
                    <Label check className='privacy-label'>
                        <Input type='radio' name='setPrivacy' value='1' disabled
                            // eslint-disable-next-line eqeqeq
                            checked={checked == 1}
                            onChange={handleChange}/>{' '}
                        <span>Permission</span>
                    </Label>
                </FormGroup>
                <FormGroup check className='col'>
                    <Label check  className='privacy-label'>
                        <Input type='radio' name='setPrivacy' value='2' 
                            // eslint-disable-next-line eqeqeq
                            checked={checked == 2}
                            onChange={handleChange}/>{' '}
                        <span >Private</span>
                    </Label>
                </FormGroup>
            </div>
        </FormGroup>
        </div>
    );
}

/**
 * seems like this should work to abstract the dropdowns but
 * it doesn't (menu opens but items don't respond to clicks)
export const ControllerDropdown = ({ DropdownInstance, text, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);
    return(
        <Dropdown isOpen={isOpen} toggle={toggle}>
            <DropdownToggle className='btn btn-outline-secondary btn-sm'>
                <img src={icon} alt={text}/>
            </DropdownToggle>
            <DropdownInstance />
        </Dropdown>
    );
}
export const PenColour = () => {
    const ColourList = () => { return <PenColourDropdown /> }
    return(
        <ControllerDropdown DropdownInstance={ColourList}
            text='Pen colour' icon={SITE.icons.penColour} />
    );
}
*/