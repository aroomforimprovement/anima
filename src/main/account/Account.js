import React, { useEffect, useReducer, createContext, useContext, useState } from 'react';
import { useMainContext } from '../Main';
import { accountReducer, getAccountInfo } from './accountReducer';
import toast from 'buttoned-toaster';
import './account.css';
import { SITE } from '../../shared/site';
import { handleFailedConnection } from '../../common/Toast';
import { Section } from './components/Section';
import { Contacts } from './components/contacts/Contacts';
import { Notices } from './components/notices/Notices';
import { Settings } from './components/settings/Settings';
import { DeleteAccount } from './components/settings/DeleteAccount';

const AccountContext = createContext({});

export const useAccountContext = () => {
    return useContext(AccountContext);
}

const Account = () => {

    const { mainState } = useMainContext();
    
    const [state, dispatch] = useReducer(accountReducer, {});
    const stateOfAccount = { state, dispatch };
    const [isLoading, setIsLoading] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if(mainState.user && mainState.user.isVerified){
            setIsVerified(mainState.user.isVerified);
        }
    }, [mainState.user])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const getAccountId = () => {
            if(mainState.user){
                return mainState.user.userid;
            }else{
                console.error("no user");
            }
        }
        const setAccountInfo = async (signal) => {
            const id = getAccountId();
            getAccountInfo(id, mainState.user.access, signal)
            .then((response) => {
                if(response){
                    setIsLoading(false);
                    dispatch({type: 'SET_ACCOUNT_INFO', data: response, signal});
                    toast.success({message:"Account page ready", toastId: 'data_fetch'})
                }else{
                    setIsFailed(true, signal);
                    dispatch({type: 'SET_ACCOUNT_INFO', data: {isSet: true}, signal})
                    console.error(SITE.failed_connection_message);
                }
            });
        }

        if(!state.isSet && !isFailed && !isLoading){
            setIsLoading(true, signal);
            setAccountInfo(signal);
        }else if(isFailed && isLoading){
            setIsLoading(false);
            console.error(SITE.failed_connection_message);
            handleFailedConnection(SITE.failed_retrieval_message, false, toast, signal);
        }

        return() => {
            controller.abort();
        }
        
    },[isFailed, isLoading, mainState.user, state.isSet]);

    return(
        <div className='container account-page'>
            <AccountContext.Provider value={stateOfAccount} >
                <AccountContext.Consumer>
                    {() => (
                        <div>
                            <Section name={`Notices`}>
                                <Notices verified={isVerified} />
                            </Section>
                            <Section name={`Contacts`} >
                                <Contacts verified={isVerified}/>
                            </Section>
                            <Section name={`Settings`} >
                                <Settings />
                            </Section>
                            <Section name={`Danger zone`}>
                                <DeleteAccount user={mainState.user} />
                            </Section>
                        </div>
                    )}
                </AccountContext.Consumer>
            </AccountContext.Provider>
        </div>
    );
}

export default Account;