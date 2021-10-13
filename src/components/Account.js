import React, { useEffect, useReducer, useState } from 'react';
import { SITE } from '../shared/site';
import { Button, Form, FormGroup, Input, InputGroup } from 'reactstrap';
import { Loading } from './partials/Loading';
import { useMainContext } from './Main';
import { addContact, accountReducer, getAccountInfo, deleteContact, deleteNotice, updateDisplayName } from '../redux/Account';


const Account = () => {

    const { mainState, mainDispatch } = useMainContext();
    const [hideNameEdit, setHideNameEdit] = useState(true);
    const [isNameUpdating, setIsNameUpdating] = useState(false);

    const [state, dispatch] = useReducer(accountReducer, {});
    
    useEffect(() => {

    },[mainState.user.notices, mainState.user.contacts, state.notices, state.contacts]);

    const getAccountId = () => {
        if(mainState.user){
            return mainState.user.userid;
        }else{
            console.error("no user");
        }
    }

    const handleEditUsername = (e) => {
        console.log("handleEditUsername");
        setHideNameEdit(!hideNameEdit);
    }

    const handleUpdateName = async (e) => {
        console.log("handleUpdateName");
        e.preventDefault();
        setIsNameUpdating(true);
        updateDisplayName(state.userid, e.target.displayName.value, mainState.user.access)
        .then((name) => {
            dispatch({type: 'SET_DISPLAY_NAME', data: name});
            mainDispatch({type: 'SET_USERNAME', data: name});
            setIsNameUpdating(false);
        });
        
        setHideNameEdit(true);
    }

    const handleAcceptNotice = (i) => {
        console.log("handleAcceptNotice");
        console.dir(state.notices[i]);
        //only handling contact req for the moment
        addContact(state.notices[i], i, mainState.user.access)
        .then((response) => {
            deleteNotice(state.notices[i], i, mainState.user.access);
        });
    }

    const handleRejectNotice = (i) => {
        console.log("handleRejectNotice");
        console.dir(state.notices[i]);
        deleteNotice(state.notices[i], i, mainState.user.access)
            .then((response) => {
                if(response.modifiedCount > 0){
                    dispatch({type: 'DELETE_NOTICE', data: i});
                }
            });
    }

    const handleVisitContact = (i) => {
        console.log("handleVisitContact");
        const id = state.contacts[i].userid;
        window.location.href = `/collection/${id}`;
    }

    const handleDeleteContact = (i) => {
        console.log("handleDeleteContact");
        deleteContact(state.contacts[i], mainState.user.userid, 
            mainState.user.username, mainState.user.access)
            .then((response) => {
                console.log("should toast to this");
            });;
    }

    const setAccountInfo = async () => {
        const id = getAccountId();
        const response = await getAccountInfo(id, mainState.user.access);
        dispatch({type: 'SET_ACCOUNT_INFO', data: response});
    }
    if(!state.isSet && mainState.user && mainState.user.access){
        setAccountInfo();
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