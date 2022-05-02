import React, { createContext, useContext, useEffect, useRef, useReducer, useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { Form, Modal, Button } from 'react-bootstrap';
import { ControlContext, useControlContext } from '../Create';
import { animReducer, newAnimState } from './animationReducer';
import { sketch } from './sketch';
import { values } from '../values';
import { Privacy } from '../controller/ControllerBtns';
import { useMainContext } from '../../Main';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router';
import toast from 'buttoned-toaster';

const apiUrl = process.env.REACT_APP_API_URL;

const AnimContext = createContext(values.initialAnimState);

export const useAnimContext = () => {
    return useContext(AnimContext);
}


export const Animation = ({edit, splat, loggingIn}) => {
    const { mainState, mainDispatch } = useMainContext();
    
    const [ access, setAccess ] = useState(null);

    const { controls, updateControls } = useControlContext();
    const initAnimState = newAnimState(mainState.user);
    const [ anim, updateAnim ] = useReducer(animReducer, initAnimState);
    const animState = { anim, updateAnim };

    const { loginWithPopup } = useAuth0();
    
    const tempSave = () => {
        window.localStorage.setItem("tempAnim", JSON.stringify(anim));
    }
    const redirectAfterTempSave = async (temp) => {
        tempSave();
        loginWithPopup(
            {
                screen_hint: 'signup'
            }
        ).then(() => {});
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const getSavedAnim = async (id, signal) => {
            return fetch(`${apiUrl}anim/${id}`,{
                    signal: signal,
                    headers: {
                        Authorization: `Bearer ${access}`,
                    }
                })
                .then(response => {
                    if(response.ok){
                        return response.json();
                    }else{
                        console.error("response not ok");
                    }
                }, error => {
                    console.error(`error fetching anim ${error}`);
                })
                .then(response => {
                    if(anim.isSet){
                        //console.log("stop calling me!")
                    }else{
                        updateAnim({type: 'SET_ANIM', data: response, signal: signal});
                    }
                })
                .catch(err => console.error(err));
        }
        if(mainState.user && mainState.user.isAuth && mainState.user.access){
            setAccess(mainState.user.access, signal);
            updateAnim({type: 'UPDATE_ANIM_USER', data: mainState.user, signal: signal});
        }
        if(!anim.isSet && splat && mainState.user && access){
            getSavedAnim(splat, signal);
        }
        return () => {
            controller.abort();
        }
    },[anim.isSet, splat, mainState.user, access]);
    

    const handleSaveSubmission = (e) => {
        //console.debug(`handleSaveSubmission`)
        updateAnim({type: 'USERID', data: true});
        if(access){
            updateAnim({type: 'SAVE_TO_ACCOUNT', data: access});
            if(anim.save){

            }
        }else{
            redirectAfterTempSave(anim.temp);
        }
        e.preventDefault();
    }

    const handleNameChange = (e) => {
        updateAnim({type: 'NAME', data: e.target.value});
    }

    const handleCancelSave = (e) => {
        updateAnim({type: 'CANCEL_SAVE', data: true});
        e.preventDefault();
    }

    const inputRef = useRef();
    useEffect(() => {inputRef.current && inputRef.current.focus()});
    const NameInput = () => {
        return(
            <Form.Control type='text' id='name' name='name' autoFocus={true}
                onChange={handleNameChange} ref={inputRef} 
                value={anim.anim.name ? anim.anim.name : undefined}/>
        );
    }

    //useEffect(() => {
    //    console.dir(anim);
    //    console.log(loggingIn);
    //    const saveTemp = () => {
    //        window.localStorage.setItem("tempAnim", JSON.stringify(anim));
    //    }
    //    const handleLoggingIn = async () => {
    //        saveTemp();
    //    }
    //    if(loggingIn){
    //        handleLoggingIn();
    //    }
    //}, [loggingIn, anim])

    if(window.localStorage.getItem('tempAnim') && !loggingIn){
        return(
            <Redirect to='/login'/>
        );
    }

    
    
    return(
        <div>
            <ControlContext.Consumer> 
                {() => (
                <AnimContext.Provider value={animState} >
                    <ReactP5Wrapper sketch={sketch} toast={toast}
                        controls={controls} updateControls={updateControls}
                        anim={anim} updateAnim={updateAnim} index={'temp'}
                        mainDispatch={mainDispatch}
                        id='animCanvas' clip={false}/>
                    <Modal show={anim.isPreviewOpen} 
                        onShow={() => updateAnim({type: 'setIsPreviewOpen', data: true})}
                        onHide={() => updateAnim({type: 'setIsPreviewOpen', data: false})}>
                            <video controls loop autoPlay className='col col-12'> 
                                <source src={anim.viewFile} type='video/webm' alt={`Previewing ${anim.name}`} />
                            </video>
                       <Modal.Footer>
                            <p>{anim.viewName}</p>
                            <Button size='sm' 
                                onClick={() => {updateControls({type: 'END_PREVIEW', data: true})}}
                            >Close</Button>
                        </Modal.Footer>
                    </Modal >
                    <Modal show={anim.isSaveOpen} 
                        onShow={() => updateAnim({type: 'SET_SAVE_OPEN', data: true})}
                        onHide={() => updateAnim({type: 'SET_SAVE_OPEN', data: false})}>
                        <Modal.Header>Save your creation to your account</Modal.Header>
                        <Form onSubmit={handleSaveSubmission}>
                            <Modal.Body>
                                <Form.Group>
                                    <Form.Label htmlFor="name">Name your creation:</Form.Label>
                                    <NameInput />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <Privacy id='create-privacy-control'/>
                                <Button className='btn btn-secondary'
                                    onClick={handleCancelSave}
                                >Cancel</Button>
                                <Button className='btn btn-success'
                                    type='submit' value='submit'
                                >Save</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </AnimContext.Provider>
                )}
            </ControlContext.Consumer>
        </div>
    );
}
