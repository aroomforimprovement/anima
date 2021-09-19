import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, 
    Form, FormGroup, Label, Input } from 'reactstrap';
import { ControlContext, useControlContext } from '../Create';
import { animReducer, newAnimState } from '../../redux/Creation';
import { sketch } from '../../animator/sketch';
import { values } from '../../animator/values';
import { Privacy } from './ControllerBtns';
import { useAuth0 } from '@auth0/auth0-react';

const apiUrl = process.env.REACT_APP_API_URL;

const AnimContext = createContext(values.initialAnimState);

export const useAnimContext = () => {
    return useContext(AnimContext);
}


export const Creation = () => {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [ access, setAccess ] = useState(null);
    
    
    useEffect(() => {
        const setAccessToken = async () => {
            setAccess(await getAccessTokenSilently());
        }
        if(isAuthenticated){
            setAccessToken();
        }
    },[isAuthenticated, getAccessTokenSilently]);


    const { controls, dispatch } = useControlContext();
    const [ anim, updateAnim ] = useReducer(animReducer, newAnimState);//startState);
    const animState = { anim, updateAnim };
    const getSavedAnim = (id) => {
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

    const getIdFromUrl = (url) => {
        console.log("url="+url);
        if(url.match(/(create\/)\w+/) && url.match(/(create\/)\w+/).length > -1){
            console.log("create page is edit");
            const id = url.substring(url.indexOf("create") + 7, url.length);
            console.log("id="+id);
            return id;
        }    
        return false;
    }

    
    const id = getIdFromUrl(window.location.href);
    if(!anim.isSet && id){
        getSavedAnim(id);
    }
    
    const handleSaveSubmission = (e) => {
        updateAnim({type: 'USERID', data: true});
        updateAnim({type: 'SAVE_TO_ACCOUNT', data: access});
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
                                    <Label htmlFor="name">Name your creation:</Label>
                                    <Input type='text' id='name' name='name' autoFocus={true}
                                        onChange={handleNameChange}/>
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
