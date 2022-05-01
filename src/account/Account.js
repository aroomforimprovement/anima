import React, { useEffect, useReducer, createContext, useContext, useState } from 'react';
import { Notice } from './components/Notice';
import { Contact } from './components/Contact';
import { DisplayName } from './components/DisplayName';
import { useMainContext } from '../main/Main';
import { accountReducer, getAccountInfo, deleteAccount } from './accountReducer';
import { useToastRack } from 'buttoned-toaster';
import { handleFailedConnection } from '../common/Toast';
import { useAuth0 } from '@auth0/auth0-react';
import './account.css';
import { SITE } from '../shared/site';

const AccountContext = createContext({});

export const useAccountContext = () => {
    return useContext(AccountContext);
}

const Account = () => {
    const [hideNotices, setHideNotices] = useState(true);
    const [hideContacts, setHideContacts] = useState(true);
    const [hideDeleteAccount, setHideDeleteAccount] = useState(true);
    const { mainState } = useMainContext();
    const { logout } = useAuth0();
    const toast = useToastRack();

    const [state, dispatch] = useReducer(accountReducer, {});
    const stateOfAccount = { state, dispatch };
    const [isFailed, setIsFailed] = useState(false);

    useEffect(() => {
        if(isFailed){
            handleFailedConnection(SITE.failed_retrieval_message, false);
        }
    }, [isFailed])

    useEffect(() => {
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
                    if(response){
                        dispatch({type: 'SET_ACCOUNT_INFO', data: response});
                    }else{
                        //dispatch({type: 'SET_ACCOUNT_INFO', data: {isSet: true}});
                        setIsFailed(true);
                    }
                });
            
        }
        if(!state.isSet && !isFailed){// && mainState.user && mainState.user.access){
            setAccountInfo();
        }
    },[mainState.user, state.notices, state.contacts, state.isSet, isFailed]);

    const handleShowContacts = () => {
        setHideContacts(!hideContacts);
    }

    const handleShowNotices = () => {
        setHideNotices(!hideNotices);
    }

    const handleShowDeleteAccount = () => {
        setHideDeleteAccount(!hideDeleteAccount);
    }

    const handleDeleteAccount = () => {
        const approve = (id) => {
            deleteAccount(mainState.user.userid, mainState.user.access)
                .then((response) => {
                    if(response && response.ok){
                        toast.success("Account deleted");
                        logout(`${process.env.REACT_APP_URL}/logout`);
                    }else{
                        toast.error("Error deleting account");
                    }
                })
            toast.dismiss(id);
        }
        const dismiss = (id) => {
            toast.dismiss(id);
        }

        toast.error(
            { 
                approveFunc: approve, 
                dismissFunc: dismiss,
                message:
                    <div>
                        <p>
                            You are about to delete your Anima account, all your anims and
                            all your contacts. Are you sure you want to delete everything?
                        </p> 
                        <p>
                            (If you log in with the same username and password again, Anima will
                            create a new account)
                        </p>
                    </div>,
                approveTxt: "Delete everything", 
                dismissTxt: "Maybe later"
            }
        );
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

    const Unverfied = () => {
        return(
            <div>Verify your account to use this feature</div>
        )
    }
    
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
                                    {mainState.user && mainState.user.isVerified
                                    ? <div className='row mb-4'>{notices}</div>
                                    : <Unverfied className='row mb-4'/>}
                                </div>
                            </div>
                            <div className='row notices'>
                                <div className='contacts-header' 
                                    onClick={handleShowContacts}>Contacts:</div>
                                <div className='container' hidden={hideContacts}>
                                    {mainState.user && mainState.user.isVerified
                                    ? <div className='row'>{contacts}</div>
                                    : <Unverfied className='row mb-4' />}
                                </div>
                            </div>
                            <div className='row notices'>
                                <div className='notices-header'
                                    onClick={handleShowDeleteAccount}>Delete Account:</div>
                                <div className='container' hidden={hideDeleteAccount}>
                                    <div className='row col-10 col-lg-7 m-auto'>
                                        <button className='btn btn-lg btn-danger shadow shadow-lg'
                                            onClick={handleDeleteAccount}>
                                                Delete my account and all of my anims forever.
                                        </button>
                                    </div>
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