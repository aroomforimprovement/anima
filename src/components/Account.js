import React, { useEffect, useReducer, createContext, useContext, useState } from 'react';
import { Notice } from './partials/Notice';
import { Contact } from './partials/Contact';
import { DisplayName } from './partials/DisplayName';
import { useMainContext } from '../App';
import { accountReducer, getAccountInfo } from '../redux/Account';

const AccountContext = createContext({});

export const useAccountContext = () => {
    return useContext(AccountContext);
}

const Account = () => {
    const [hideNotices, setHideNotices] = useState(true);
    const [hideContacts, setHideContacts] = useState(true);
    const { mainState } = useMainContext();


    const [state, dispatch] = useReducer(accountReducer, {});
    const stateOfAccount = { state, dispatch };
    
    useEffect(() => {
        console.log("mainState.user:");
        console.dir(mainState.user);
        console.log("state.notices:");
        console.dir(state.notices);
        console.log("state.contacts:");
        console.dir(state.contacts);
    },[mainState.user, state.notices, state.contacts]);

    const getAccountId = () => {
        if(mainState.user){
            return mainState.user.userid;
        }else{
            console.error("no user");
        }
    }
    
    const setAccountInfo = async () => {
        const id = getAccountId();
        getAccountInfo(id, mainState.user.access)
            .then((response) => {
                dispatch({type: 'SET_ACCOUNT_INFO', data: response});
            });
        
    }
    if(!state.isSet && mainState.user && mainState.user.access){
        setAccountInfo();
    }

    const handleShowContacts = () => {
        setHideContacts(!hideContacts);
    }

    const handleShowNotices = () => {
        setHideNotices(!hideNotices);
    }

    const notices = state.notices && state.notices.length > 0 
        ? state.notices.map((notice, i) => {
            
            const link = `/collection/${notice.actions.accept}`;
            return(
                <Notice notice={notice} link={link} i={i} key={i}/>
            );
        })
        : <div>Nothing to report</div>

    const contacts = state.contacts && state.contacts.length > 0
        ? state.contacts.map((contact, i) => {
            return(
                <Contact contact={contact} i={i} key={i} />
            );
        }) 
        : <div>Nobody here</div>

    return(
        <div className='container account-page'>
            <AccountContext.Provider value={stateOfAccount} >
                <AccountContext.Consumer>
                    {() => (
                        <div>
                            <DisplayName />
                            <div className='row notices'>
                                <div className='notices-header' 
                                    onClick={handleShowNotices}>Notifications:</div>
                                <div className='container' hidden={hideNotices}>
                                    <div className='row mb-4'>{notices}</div>
                                </div>
                            </div>
                            <div className='row notices'>
                                <div className='contacts-header' 
                                    onClick={handleShowContacts}>Contacts:</div>
                                <div className='container' hidden={hideContacts}>
                                    <div className='row'>{contacts}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </AccountContext.Consumer>
            </AccountContext.Provider>
        </div>
    );
}

export default Account;