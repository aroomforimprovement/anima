import React, { useEffect, useReducer, createContext, useContext } from 'react';
import { Notice } from './partials/Notice';
import { Contact } from './partials/Contact';
import { DisplayName } from './partials/DisplayName';
import { useMainContext } from './Main';
import { accountReducer, getAccountInfo } from '../redux/Account';

const AccountContext = createContext({});

export const useAccountContext = () => {
    return useContext(AccountContext);
}

const Account = () => {

    const { mainState } = useMainContext();


    const [state, dispatch] = useReducer(accountReducer, {});
    const stateOfAccount = { state, dispatch };
    
    useEffect(() => {

    },[mainState.user.notices, mainState.user.contacts, state.notices, state.contacts]);

    const getAccountId = () => {
        if(mainState.user){
            return mainState.user.userid;
        }else{
            console.error("no user");
        }
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
                <Notice notice={notice} i={i} link={link}/>
            );
        })
        : <div>Nothing to report</div>

    const contacts = state.contacts && state.contacts.length > 0
        ? state.contacts.map((contact, i) => {
            return(
                <Contact contact={contact} i={i} />
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
                            <div className='row'>
                                <div className='col col-2'>Notifications</div>
                                <div className='col col-8'>{notices}</div>
                            </div>
                            <div className='row'>
                                <div className='col col-2'>Contacts</div>
                                <div className='col col-8'>{contacts}</div>
                            </div>
                        </div>
                    )}
                </AccountContext.Consumer>
            </AccountContext.Provider>
        </div>
    );
}

export default Account;