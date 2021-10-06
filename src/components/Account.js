import React, { useEffect, useReducer, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { SITE } from '../shared/site';
import { Button, Form, FormGroup, Input, InputGroup } from 'reactstrap';
import { Loading } from './partials/Loading';


const apiUrl = process.env.REACT_APP_API_URL;

const Account = () => {
    const [access, setAccess] = useState(null);
    const { isLoading, isAuthenticated, getAccessTokenSilently, user } = useAuth0(); 
    const [hideNameEdit, setHideNameEdit] = useState(true);
    const [isNameUpdating, setIsNameUpdating] = useState(false);

    const accountReducer = (state, action) => {
        switch(action.type){
            case 'SET_ACCOUNT_INFO':
                console.log('SET_ACCOUNT_INFO: ');
                console.dir(action.data);
                return({...state, 
                    userid: action.data.userid,
                    username: action.data.username,
                    notices: action.data.notices,
                    contacts: action.data.contacts,
                    isSet: true,
                });
            case 'SET_DISPLAY_NAME':
                return ({...state, username: action.data});
            case 'DELETE_NOTICE':
                let notices = [...state.notices]
                notices = notices.splice(action.data, 1);
                return ({...state, notices: notices});
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
            }
        }, error => {
            console.error("error fetching anim " + error);
        })
        .then(response => response.json())
        .then(response => {
            dispatch({type: 'SET_ACCOUNT_INFO', data: response});
        })
        .catch(err => console.error(err))
    }

    const updateDisplayName = (id, name) => {
        return fetch(`${apiUrl}collection`, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({userid: id, username: name, verb: 'update'}),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access}`,
            }
        })
        .then(response => {
            if(response.ok){
                return response
            }
        }, error => {
            console.error(error);
        })
        .then(response => response.json())
        .then(response => {
            dispatch({type: 'SET_DISPLAY_NAME', data: name});
            setIsNameUpdating(false);
        })
        .catch((error) => {
            console.error(error);
        })
    }

    const deleteNotice = (notice, i) => {
        notice.verb = 'delete';
        return fetch(`${apiUrl}collection`, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(notice),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            }
        })
        .then(response => {
            if(response.ok){
                return response;
            }
        }, error => {
            console.error(error);
        })
        .then(response => response.json())
        .then(response => {
            if(response.modifiedCount > 0){
                dispatch({type: 'DELETE_NOTICE', data: i});
            }
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
        setIsNameUpdating(true);
        updateDisplayName(state.userid, e.target.displayName.value);
        setHideNameEdit(true);
    }

    const handleAcceptNotice = (i) => {
        console.log("handleAcceptNotice");
        console.dir(state.notices[i]);
    }

    const handleRejectNotice = (i) => {
        console.log("handleRejectNotice");
        console.dir(state.notices[i]);
        deleteNotice(state.notices[i], i);
    }

    const handleVisitContact = (i) => {
        console.log("handleVisitContact");
        const id = state.contacts[i].userid;
        window.location.href = `/collection/${id}`;
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
            
            const link = `/collection/${notice.actions.accept}`;
            return(
                <div className='container notice' key={i}>
                    <div>{notice.message}</div>
                    <a href={link} target='_blank' rel='noreferrer' alt='Visit the requester profile'>
                        Check out their profile
                    </a>
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
                    <div>{contact.username}</div>
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
                    {isNameUpdating 
                    ? <Loading /> 
                    :
                    <div>
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
                    }
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