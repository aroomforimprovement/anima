import React, { createContext, useContext, useEffect, useRef, useReducer, useState } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { Form, Modal, Button } from 'react-bootstrap';
import { ControlContext, useControlContext } from '../Create';
import { animReducer, newAnimState } from './animationReducer';
import { sketch } from './sketch';
import { values } from '../values';
import { Privacy } from '../controller/ControllerBtns';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router';
import { useAccount } from '../../../shared/account';
import { isMobile } from 'react-device-detect';
import toast from 'buttoned-toaster';
import { Conversation } from '../messages/components/Conversation';
import { Div } from '../../../common/Div';
import { Controller, SaveController } from '../controller/Controller';

const apiUrl = process.env.REACT_APP_API_URL;

const AnimContext = createContext(values.initialAnimState);

export const useAnimContext = () => {
    return useContext(AnimContext);
}


export const Animation = ({splat}) => {
    const {account} = useAccount();
    
    const [ access, setAccess ] = useState(null);

    const { controls, updateControls } = useControlContext();
    const initAnimState = newAnimState(account.user);
    const [ anim, updateAnim ] = useReducer(animReducer, initAnimState);
    const animState = { anim, updateAnim };
    const [isMessage, setIsMessage] = useState(window.location.href.indexOf('=') > -1);
    const [name, setName] = useState(anim?.anim?.name);
    
    useEffect(() => {
        if(anim.anim.name){
            setName(anim.anim.name)
        }
    }, [anim?.anim?.name])

    const { loginWithPopup } = useAuth0();
    
    const tempSave = () => {
        window.localStorage.setItem("tempAnim", JSON.stringify(anim));
    }
    const redirectAfterTempSave = async () => {
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

        const getConversation = async (id, signal) => {
            return fetch(`${apiUrl}messages/${id}`,{
                signal: signal,
                headers: {
                    Authorization: `Bearer ${access}`,
                }
            }).then(response => {
                if(response.ok){
                    return response.json();
                }else{
                    console.error("response not ok");
                }
            }, error => {
                console.error(error);
            }).then(response => {
                console.log(response);
                updateAnim({type: 'SET_CONVERSATION', data: response});
            }).catch(err => console.error(err));
        }

        if(account.user && account.user.isAuth && account.user.access){
            setAccess(account.user.access, signal);
            updateAnim({type: 'UPDATE_ANIM_USER', data: account.user, signal: signal});
        }
        if(!anim.isSet && splat && account.user && access){
            if(splat.indexOf('=') > -1){
                getConversation(splat, signal);
            }else{
                getSavedAnim(splat, signal);
            }
        }
        return () => {
            controller.abort();
        }
    },[anim?.isSet, splat, account?.user, access]);

    const handleSaveSubmission = (e) => {
        e.preventDefault();
        updateAnim({type: 'USERID', data: true})
        updateAnim({type: 'NAME', data: name})
        if(access){
            if(isMessage){
                toast.info("Sending as message...");
                updateAnim({type: 'SEND_AS_MESSAGE', data: access});
            }else{
                toast.info("Saving to account...");
                updateAnim({type: 'SAVE_TO_ACCOUNT', data: access});  
            }
        }else{
            redirectAfterTempSave(anim.temp);
        }
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
        e.preventDefault();
        
    }

    const handleCancelSave = (e) => {
        updateAnim({type: 'CANCEL_SAVE', data: true});
        e.preventDefault();
    }

    const NameInput = () => {
        const inputRef = useRef(null);

        useEffect(() => {inputRef.current && inputRef.current.focus()});
        
        return(
            <Form.Control 
                type='text' 
                id='name' 
                name='name' 
                autoFocus={isMobile ? false : true}
                onChange={handleNameChange} 
                ref={inputRef} 
                maxLength='140'
                defaultValue={name}/>
        );
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
                <AnimContext.Provider value={animState} >
                    <div className='container'>
                        <div className='row'>
                            {isMessage  && anim?.conversation 
                            ?
                            <Conversation 
                                className='col col-4'
                                conversation={anim.conversation}
                                updateAnim={updateAnim}/> 
                            : <Div/>}
                            <Controller />
                            <ReactP5Wrapper 
                                sketch={sketch}
                                controls={controls} updateControls={updateControls}
                                anim={anim} updateAnim={updateAnim} index={'temp'}
                                id='animCanvas' clip={false}/>
                            <SaveController />
                        </div>
                    </div>
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
