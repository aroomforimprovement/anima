import React, { createContext, useContext, useReducer, useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { ControlContext, useControlContext } from '../Create';
import { animReducer, initialAnimState } from '../../redux/Creation';
import { sketch } from '../../animator/sketch';
import { values } from '../../animator/values';


const AnimContext = createContext(values.initialAnimState)

export const useAnimContext = () => {
    return useContext(AnimContext);
}


export const Creation = () => {
    const { controls, dispatch } = useControlContext();
    
    const [ anim, updateAnim ] = useReducer(animReducer, initialAnimState);
    const animState = { anim, updateAnim };
    


    const handleSaveSubmission = (e) => {
        updateAnim({type: 'SAVE_TO_ACCOUNT', data: true});
        e.preventDefault();
    }

    const handleNameChange = (e) => {
        console.log("handleNameChange: "+e.target.value);
        updateAnim({type: 'NAME', data: e.target.value});
    }

    const handleCancelSave = (e) => {
        updateAnim({type: 'CANCEL_SAVE', data: true});
        e.preventDefault();
    }
    
    return(
        <div>
            <ControlContext.Consumer> 
                {() => (
                <AnimContext.Provider value={animState}>
                    <ReactP5Wrapper sketch={sketch} 
                        controls={controls} dispatch={dispatch}
                        anim={anim} updateAnim={updateAnim}
                        id='animCanvas'
                    />

                    <Modal isOpen={anim.isPreviewOpen} 
                        toggle={() => updateAnim({type: 'setIsPreviewOpen', data: !anim.isPreviewOpen})}>
                        <img src={anim.previewFile} alt={`Previewing ${anim.previewName}`} />
                        <ModalFooter>
                            <p>{anim.previewName}</p>
                            <Button size='sm' 
                                onClick={() => dispatch({type: 'END_PREVIEW', data: true})}
                            >Close</Button>
                        </ModalFooter>
                    </Modal >

                    <Modal isOpen={anim.isSaveOpen} 
                        toggle={() => updateAnim({type: 'setIsOpen', data: !anim.isSaveOpen})}>
                        <ModalHeader>Save your creation to your account</ModalHeader>
                        <Form onSubmit={handleSaveSubmission}>
                            <ModalBody>
                                
                                <FormGroup>
                                    <Label for="name">Name your creation:</Label>
                                    <Input type='text' id='name' name='name' autoFocus={true}
                                        onChange={handleNameChange}/>
                                </FormGroup>

                            </ModalBody>
                            <ModalFooter>
                                <Button className='btn btn-secondary'
                                    onClick={handleCancelSave}
                                >Cancel</Button>
                                <Button className='btn btn-success'
                                    type='submit' value='submit'
                                >Save</Button>
                            </ModalFooter>
                        </Form>
                    </Modal>
                </AnimContext.Provider>
                )}
            </ControlContext.Consumer>
        </div>
    );
}
