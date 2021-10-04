import React, { useEffect, useReducer, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { SITE } from '../shared/site';
import { Button, Form, FormGroup, Input, InputGroup } from 'reactstrap';

const apiUrl = process.env.REACT_APP_API_URL;

const Account = () => {
    const [access, setAccess] = useState(null);
    const { isLoading, isAuthenticated, getAccessTokenSilently, user } = useAuth0(); 
    const [hideNameEdit, setHideNameEdit] = useState(true);

    const accountReducer = (state, action) => {
        switch(action.type){
            case 'SET_ACCOUNT_INFO':
                return({...state, 
                    userid: action.data.userid,
                    username: action.data.username,
                    notices: action.data.notices,
                    contacts: action.data.contacts
                });
            default:
                break;
        }
    }

    const [state, dispatch] = useReducer(accountReducer, {});
    
    
    const getAccountInfo = (id) => {
        return fetch(`${apiUrl}collection/${id}`, {
            headers: {
                Authorization: `Bearer ${access}`
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
            console.error("error fetching anim " + error);
        })
        .then(response => response.json())
        .then(response => {
            console.log("got account info");
            console.dir(response);
            dispatch({type: 'SET_ACCOUNT_INFO', data: response});
        })
        .catch(err => console.error(err))
        .finally(response => {
            console.log("finally");
            console.dir(response);
        })
    }

    const getAccountId = () => {
        if(user){
            return user.sub.replace('auth0|', '');
        }else{
            console.log("no user");
        }
    }

    const handleEditUsername = (e) => {
        console.log("handleEditUsername");
        setHideNameEdit(!hideNameEdit);
    }

    const handleUpdateName = (e) => {
        console.log("handleUpdateName");
        e.preventDefault();

    }

    const handleAcceptNotice = (i) => {
        console.log("handleAcceptNotice");
    }

    const handleRejectNotice = (i) => {
        console.log("handleRejectNotice");
    }

    const handleVisitContact = (i) => {
        console.log("handleVisitContact");
    }

    const handleDeleteContact = (i) => {
        console.log("handleDeleteContact");
    }


    useEffect(() => {
        const setAccessToken = async () => {
            setAccess(await getAccessTokenSilently());
        }
        if(!isLoading && isAuthenticated){
            setAccessToken();
        }
    },[isAuthenticated, isLoading, getAccessTokenSilently, access]);

    if(!state.isSet && access){
        //get user id
        const id = getAccountId();
        getAccountInfo(id);
    }

    const notices = state.notices && state.notices.length > 0 
        ? state.notices.map((notice, i) => {
            return(
                <div className='container notice' key={i}>
                    <div>{notice.message}</div>
                    <button className='btn btn-outline-secondary btn-sm'
                        onClick={() => handleRejectNotice(i)}>
                        <img src={SITE.icons.wipe} alt={`Reject`} />
                    </button>
                    <button className='btn btn-outline-primary btn-sm'
                        onClick={() => handleAcceptNotice(i)}>
                        <img src={SITE.icons.save} alt={`Accept`} />
                    </button>
                </div>
            );
        })
        : <div>Nothing to report</div>

    const contacts = state.contacts && state.contacts.length > 0
        ? state.contacts.map((contact, i) => {
            return(
                <div className='container contact' key={i}>
                    <div>{contact.name}</div>
                    <button className='btn btn-outline-success btn-sm'
                        onClick={() => handleVisitContact(i)}>
                        <img src={SITE.icons.preview} alt={`Visit ${contact.name}`}/>
                    </button>
                    <button className='btn btn-outline-danger btn-sm'
                        onClick={() => handleDeleteContact(i)}>
                        <img src={SITE.icons.wipe} alt={`Delete ${contact.name} from contacts`}/>
                    </button>
                </div>
            );
        }) 
        : <div>Nobody here</div>

    return(
        <div className='container account-page'>
            <div className='row mt-4 border border-black m-2'>
                <div className='col-3'>
                    Display name:
                </div>
                <div className='col col-8'>
                    <div hidden={!hideNameEdit}><strong >{state.username}</strong></div>
                    <Form onSubmit={handleUpdateName} hidden={hideNameEdit}>
                        <FormGroup >
                            <InputGroup>
                                <Input size='sm' type='text' name='displayName' id='displayName' defaultValue={state.username}/>
                                <Button size='sm' color='secondary' onClick={handleEditUsername}>Cancel</Button>
                                <Button size='sm' color='primary'>Save</Button>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                </div>
                <div className='col col-1 fa fa-edit mt-1'
                    onClick={handleEditUsername}>
                    {''}
                </div>
            </div>
            <div className='row'>
                <div className='col col-2'>Notifications</div>
                <div className='col col-8'>{notices}</div>
            </div>
            <div className='row'>
                <div className='col col-2'>Contacts</div>
                <div className='col col-8'>{contacts}</div>
            </div>
        </div>
    );
}

export default Account;