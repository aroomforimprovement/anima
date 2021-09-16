import React, { createContext, useContext, useReducer, useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { ControlContext, useControlContext } from '../Create';
import { Preview } from './Preview';
import { values } from '../../animator/values';


const AnimContext = createContext(values.initialAnimState)

export const useAnimContext = () => {
    return useContext(AnimContext);
}

export const Creation = ({sketch}) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const { controls, dispatch } = useControlContext();
    
    const saveAnimToAccount = (a) => {
        console.log("saveAnimToAccount:");
        console.dir(a);
    }
    
    
    const animReducer = (state, action) => {
        console.log(action.type+':'+action.data);
        switch(action.type){
            case 'ENABLED':{
                return ({...state, enabled: action.data})
            }
            case 'DO_STROKE':{
                let newUndos = [...state.undos];
                let newRedos = [...state.redos];
                let isSameAsPrevious = newUndos[newUndos.length-1] === action.data;
                if(!isSameAsPrevious){
                    newUndos.push(action.data);
                }
                if(state.undid.length > 0){
                    newRedos = [];
                }
                return ({...state, undos: newUndos, 
                    redid: [], undid:[], redos: newRedos });
            }
            case 'UNDO_STROKE':{
                let newRedos = [...state.redos];
                let newUndos = [...state.undos];
                const undid = newUndos.pop();
                if(undid){
                    newRedos.push(undid);
                }
                return ({ ...state, 
                    redos: newRedos, undos: newUndos, 
                    undid: undid ? undid : [], redid: []});
            }
            case 'REDO_STROKE':{
                let newRedos = [...state.redos];
                let newUndos = [...state.undos];
                const redid = newRedos.pop();
                if(redid){
                    newUndos.push(redid);
                }
                return ({ ...state, 
                    redos: newRedos, undos: newUndos,
                    undid: [], redid: redid ? redid : []});
            }
            case 'FRATE':{
                return ({...state, "anim": {...state["anim"], frate: action.data}});
            }
            case 'SAVE_BG':{
                const bg = state.undos.length > 0 ? [...state.undos] : [];
                return ({...state, bg: bg});
            }
            case 'DRAW_BG':{
                return ({...state, undos: [], redos: [], undid: [], redid: []});
            }
            case 'WIPE':{
                return ({...state, redos: [], undos: [], redid:[], undid:[]});
            }
            case 'NEXT':{
                const points = state.undos.length > 0 ? [...state.undos] : [];
                const fid = state.fid; 
                const newFid = state.fid + 1;
                const animid = state.animid ? state.animid : '1234567890';
                const bg = state.bg;
                const frame = {fid: fid, animid: animid, points: points, bg: bg};
                return ({...state, 
                    anim:{...state["anim"],
                    frames: [...state["anim"]["frames"], frame]},
                    undos: [], redos: [], undid: [], redid: [], fid: newFid 
                });
            }
            case 'PREVIEW':{
                setIsPreviewOpen(true);
                return({...state,
                    isPreviewOpen: true});
            }
            case 'END_PREVIEW':{
                setIsPreviewOpen(false);
                return({...state,
                    isPreviewOpen: false, enabled: true});
            }
            case 'PLAY_PREVIEW':{
                return ({...state, 
                    previewFile: URL.createObjectURL(action.data.blob), 
                    previewName: action.data.name
                });
            }
            case 'NAME':{
                return ({...state,
                    anim: {...state["anim"], name: action.data}})
            }
            case 'SAVE':{
                setIsSaveOpen(true);
                return ({...state, enabled: false});
            }
            case 'SAVE_TO_ACCOUNT':{
                saveAnimToAccount(state.anim);
                setIsSaveOpen(false);
                return ({...state, enabled: true});
            }
            case 'CANCEL_SAVE':{
                setIsSaveOpen(false);
                return({...state, enabled: true});
            }
            default:
                console.log("reached DEFAULT");
                return state;
        }
    }
    
    const [ anim, updateAnim ] = useReducer(animReducer, values.initialAnimState);
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
                        onMouseOver={() => dispatch({type: 'ENABLE', data: true})} 
                        onMouseOut={() => dispatch({type: 'DISABLE', data: true})} 
                    />
                    <Modal isOpen={isPreviewOpen} toggle={() => setIsPreviewOpen(!isPreviewOpen)}
                        onClose={() => {updateAnim ? updateAnim({type: 'ENABLED', data: true}): console.log('')}}
                    
                    >
                        <img src={anim.previewFile} alt={`Previewing ${anim.previewName}`} />
                        <ModalFooter>
                            <p>{anim.previewName}</p>
                            <Button size='sm' 
                                onClick={() => dispatch({type: 'END_PREVIEW', data: true})}
                            >Close</Button>
                        </ModalFooter>
                    </Modal >

                    <Modal isOpen={isSaveOpen} toggle={() => setIsSaveOpen(!isSaveOpen)}>
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
                                    //onClick={handleSaveSubmission}
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
