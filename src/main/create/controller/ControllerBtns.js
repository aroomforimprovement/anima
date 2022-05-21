import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
    FormGroup, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { SITE } from '../../../shared/site';
import { CC, CONTROLS, values } from '../values';
import { useControlContext } from '../Create';
import { ShortcutInfo } from './ControllerInfo';
import toast from 'buttoned-toaster';

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
    const { updateControls } = useControlContext();
    const handle = (val) => {
        updateControls({ type: 'MODE', data: val });
        updateControls({ type: 'ENABLE', data: true });
    }
    
    return(
        <DropdownMenu 
            onMouseOver={() => updateControls({type: 'DISABLE', data: true})} 
            onMouseOut={() => updateControls({type: 'ENABLE', data: true})}>
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
                <img src={SITE.icons.drawingMode} 
                    title='Drawing Mode' alt='Drawing Mode'/>
            </DropdownToggle>
            <ModeDropdown />
        </Dropdown>
    );
}

const PenSizeDropdown = () => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        updateControls({ type: 'PS', data: val});
        updateControls({ type: 'ENABLE', data: true });
    }

    const sizes = values.penSizes.map((size) => {
        return(
            <ControllerDropdownItem key={size}
                title={`Pen size ${size}`} func={() => handle(CC[`PS_${size}`])}
                iSrc={SITE.icons.penSize} text={size}/>
        );
    });
    return(
        <DropdownMenu onMouseOver={() => updateControls({type: 'DISABLE', data: true})} onMouseOut={() => updateControls({type: 'ENABLE', data: true})}>
                {sizes}
        </DropdownMenu>  
    );

}

export const PenSize = () => {
    const { controls } = useControlContext();
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);
    const [size, setSize] = useState(1);


    useEffect(() => {
        //pretty hacky - would need to reorganise the CONTROLS object
        const handleSizeChange = () => {
            let size;
            CONTROLS.forEach((controlObj) => {
                if(controlObj.t === CC.TYPE_SIZE){
                    if(controlObj.v === controls.ps){
                        size = parseInt(controlObj.n.substring(3,4));
                        setSize(size);
                        return;
                    }
                }
            });
            toast.success({message: size, duration:1000});
        }
        handleSizeChange();
    },[controls.ps]);

    return(
        <Dropdown isOpen={isOpen} toggle={toggle} >
            <div className='btn-container'>
                <DropdownToggle >
                    <img src={SITE.icons.penSize} 
                    title='Pen size' alt='Pen size'/>              
                </DropdownToggle>
            </div>
            <div className='btn-caption'>{size}</div>
            <PenSizeDropdown />
        </Dropdown>
    );
}

const PenColourDropdown = () => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        updateControls({ type: 'PC', data: val});
        updateControls({ type: 'ENABLE', data: true });
    }
    return(
        <DropdownMenu onMouseOver={() => updateControls({type: 'DISABLE', data: true})} onMouseOut={() => updateControls({type: 'ENABLE', data: true})}>
            <ControllerDropdownItem 
                title='BG Solid' func={() => handle(values.bg_solid)}
                iSrc={SITE.icons.penColour} c='bg_solid' text='BG Solid'/>
            <ControllerDropdownItem 
                title='BG Shade' func={() => handle(values.bg_shade)}
                iSrc={SITE.icons.penColour} c='bg_shade' text='BG Shade'/>
            <ControllerDropdownItem 
                title='FG Solid' func={() => handle(values.fg_solid)}
                iSrc={SITE.icons.penColour} c='fg_solid' text='FG Solid'/>
            <ControllerDropdownItem 
                title='FG Shade' func={() => handle(values.fg_shade)}
                iSrc={SITE.icons.penColour} c='fg_shade' text='FG Shade'/>
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

    useEffect(() => {
        const handleColourChange = () => {
            let colour = 'black';
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
            toast.success({message: colour, duration:1000});
        }
        handleColourChange();
    },[controls.pc]);
    
    
    return(
        <Dropdown isOpen={isOpen} toggle={toggle} >
            <div className='btn-colour-container'>
                <DropdownToggle >
                    <img src={SITE.icons.penColour} 
                        title='Pen colour' alt='Pen colour'/>
                </DropdownToggle>
                <div className={`btn-colour-caption`} style={{backgroundColor: colour}} ></div>
            </div>
            <PenColourDropdown />
        </Dropdown>
    );
}

const FrameRateDropdown = () => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        updateControls({ type: 'FRAME_RATE', data: val});
        updateControls({ type: 'ENABLE', data: true });
        toast.success({message: val, duration:1000});
    }

    const rates = values.frameRates.map((rate) => {
        return(
            <ControllerDropdownItem key={rate}
                title={`Frame rate ${rate}`} func={() => handle(rate)}
                iSrc={SITE.icons.penSize} text={rate}/>
        );
    })

    return(
        <DropdownMenu onMouseOver={() => updateControls({type: 'DISABLE', data: true})} onMouseOut={() => updateControls({type: 'ENABLE', data: true})}>
                {rates}
        </DropdownMenu>  
    );

}

export const FrameRate = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);
    return(
        <Dropdown isOpen={isOpen} toggle={toggle} >
            <DropdownToggle >
                <img src={SITE.icons.frate} title='Frame rate' alt='Frame rate'/>
            </DropdownToggle>
            <FrameRateDropdown />
        </Dropdown>
    );
}

export const BackgroundDropdown = () => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        updateControls({type: val, data: true});
        updateControls({type: 'ENABLE', data: true});
        toast.success({message: val, duration:1000});
    }
    return(
        <DropdownMenu onMouseOver={() => updateControls({type: 'DISABLE', data: true})} onMouseOut={() => updateControls({type: 'ENABLE', data: true})}>
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
                <img src={SITE.icons.bg}
                    title='Background' alt='Background'/>
            </DropdownToggle>
            <BackgroundDropdown />
        </Dropdown>
    ); 
}

const ControllerBtn = ({ dispatchType, btnText, icon }) =>{
    const { updateControls } = useControlContext();
    const handle = async () => {
        updateControls({type: dispatchType, data: true});
        toast.success({message: dispatchType, duration:1000});
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

export const AdjustBgDropdown = () => {
    const { updateControls } = useControlContext();
    const handle = (val) => {
        updateControls({type: 'ADJUST_BG_OVERLAY', data: val});
        updateControls({type: 'ENABLE', data: true});
    }
    const options = values.bgOverlayVals.map((value) => {
        return(
            <ControllerDropdownItem 
                key={value}
                title={`Opacity to ${value}`}
                func={() => handle(value)}
                iSrc={SITE.icons.bg} text={value} />
        )
    })
    return(
        <DropdownMenu onMouseOver={() => updateControls({type: 'DISABLE', data: true})} onMouseOut={() => updateControls({type: 'ENABLE', data: true})}>
            {options}
        </DropdownMenu>
    )
}

export const AdjustBg = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prevState => !prevState);

    return(
        <Dropdown isOpen={isOpen} toggle={toggle}>
            <DropdownToggle>
                <img src={SITE.icons.bg}
                    title='Adjust background opacity'
                    alt='Ajust background opacity' />
            </DropdownToggle>
            <AdjustBgDropdown />
        </Dropdown> 
    )
}

export const EnableShortcuts = () => {

    const { updateControls } = useControlContext();
    const [isOpen, setIsOpen] = useState(false);

    const handleCheck = (e) => {
        updateControls({type: 'ENABLE_SHORTCUTS', data: e.target.checked});
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
    const { controls, updateControls } = useControlContext();
    const [ checked, setChecked ] = useState(controls.currentPrivacy);
    const handleChange = (e) => {
        setChecked(e.target.value);
        updateControls({type: 'PRIVACY', data: parseInt(e.target.value)});
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