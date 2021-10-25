import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, 
    Form, FormGroup, Label, Input } from 'reactstrap';
import { ControlContext, useControlContext } from '../Create';
import { animReducer, newAnimState } from '../../redux/Creation';
import { sketch } from '../../animator/sketch';
import { values } from '../../animator/values';
import { Privacy } from './ControllerBtns';
import { useMainContext } from '../Main';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router';

const apiUrl = process.env.REACT_APP_API_URL;

const AnimContext = createContext(values.initialAnimState);

export const useAnimContext = () => {
    return useContext(AnimContext);
}


export const Creation = () => {

    const { mainState } = useMainContext();
    
    const [ access, setAccess ] = useState(null);

    const { controls, dispatch } = useControlContext();
    const initAnimState = newAnimState(mainState.user);
    const [ anim, updateAnim ] = useReducer(animReducer, initAnimState);
    const animState = { anim, updateAnim };

    const { loginWithPopup } = useAuth0();

    const getIdFromUrl = (url) => {
        if(url.match(/(create\/)\w+/) && url.match(/(create\/)\w+/).length > -1){
            console.log("create page is edit");
            const id = url.substring(url.indexOf("create") + 7, url.length);
            console.log("id="+id);
            return id;
        }    
        return false;
    }

    
    const id = getIdFromUrl(window.location.href);
    
    const tempSave = () => {
        window.localStorage.setItem("tempAnim", JSON.stringify(anim));
    }
    const redirectAfterTempSave = (temp) => {
        //updateAnim({type: 'SET_TEMP', data: false});
        tempSave();
        loginWithPopup(
            {
                screen_hint: 'signup'
            }
        ).then(() => {window.location.href = '/login'});
    }

    useEffect(() => {
        const getSavedAnim = (id) => {
            console.log("getSavedAnim");
            return fetch(`${apiUrl}anim/${id}`,{
                    headers: {
                        Authorization: `Bearer ${access}`,
                    }
                })
                .then(response => {
                    if(response.ok){
                        return response;
                    }else{
                        console.error("response not ok");
                        console.dir(response);
                    }
                }, error => {
                    console.error("error fetching anim" + error);
                })
                .then(response => response.json())
                .then(response => {
                    //assign response to anim here
                    console.log("got anim");
                    console.dir(response);
                    if(anim.isSet){
                        console.log("stop calling me!")
                    }else{
                        updateAnim({type: 'SET_ANIM', data: response});
                    }
                })
                .catch(err => console.log(err))
                .finally(response => {
                    console.log("finally");
                    console.dir(response);
                });
        }
        if(mainState.user && mainState.user.isAuth && mainState.user.access){
            setAccess(mainState.user.access);
            updateAnim({type: 'UPDATE_ANIM_USER', data: mainState.user});
        }
        if(!anim.isSet && id && mainState.user && access){
            console.log('!anim.isSet && id', access);
            
            getSavedAnim(id);
        }
    },[anim.isSet, id, mainState.user, access]);
    

    const handleSaveSubmission = (e) => {
        
        updateAnim({type: 'USERID', data: true});
        if(access){
            updateAnim({type: 'SAVE_TO_ACCOUNT', data: access});
        }else{
            redirectAfterTempSave(anim.temp);
        }
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

    if(window.localStorage.getItem('tempAnim')){
        return(
            <Redirect to='/login'/>
        );
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
                            <video controls loop autoPlay> 
                                <source src={anim.previewFile} type='video/webm' alt={`Previewing ${anim.name}`} />
                            </video>
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
                                    <Label htmlFor="name">Name your creation:</Label>
                                    <Input type='text' id='name' name='name' autoFocus={true}
                                        onChange={handleNameChange} value={anim.anim.name ? anim.anim.name : undefined}/>
                                </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                            <Privacy id='create-privacy-control'/>
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
