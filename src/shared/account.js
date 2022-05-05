import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import toast from 'buttoned-toaster';
import { handleFailedConnection } from '../common/Toast';
import { SITE } from './site';
import { getAccountInfo } from '../main/account/accountReducer';
import { arrayRemove } from '../utils/utils';

/**Very much a draft, not working at all */
const reducer = (state, action) => {
    console.log(action.type);
    switch(action.type){
        case 'CHECK_AUTH':{
            //should get really get display name from db (or update on auth0)
            let storedUser = {isAuth: false};
            if(action.data.isAuthenticated){
                const user = action.data.user;
                const userid = user.sub.replace('auth0|', '');
                const verified = user.email_verified;
                storedUser = {
                    userid: userid, 
                    email: user.email,
                    username: user.nickname, 
                    isAuth: true, 
                    isVerified: verified, 
                    access: user.access
                }
            }
            return({...state, user: storedUser});
        }
        case 'SET_ACCESS':{
            let user = {};
            if(state.user){
                user = {...state.user};
            }
            user.access = action.data
            return({...state, user: user});
        }
        case 'SET_ACCOUNT_INFO':{
            return({...state, contacts: action.data.contacts, notices: action.data.notices, 
                user: {...state.user, username: action.data.username ? action.data.username : state.user.username}, isSet: action.data.isSet});
        }
        case 'SET_USERNAME':{
            return({...state, user: {...state.user, username: action.data}})
        }
        case 'DELETE_NOTICE':{
            let notices = [...state.notices];
            const notice = notices[action.data];
            const newNotices = arrayRemove(notices, notice); 
            return ({...state, notices: newNotices});
        }
        case 'DELETE_CONTACT':{
            let contacts = [...state.contacts];
            const contact = contacts[action.data];
            const newContacts = arrayRemove(contacts, contact);
            return ({...state, contacts: newContacts});
        }
        default:
            return state;
    }
}

export let accountStore = {isSet: false};
const listeners = [];

const useAccountStore = () => {

    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [state, setState] = useState(accountStore);

    useEffect(() => {
        listeners.push(setState);
        return() => {
            const index = listeners.indexOf(setState);
            if(index > -1){
                listeners.splice(index, 1);
            }
        }
    }, [setState])
    
   const dispatch = (action) => {
        accountStore = reducer(accountStore, action);
        for(const listener of listeners){
            listener(accountStore);
        }
        //setState(accountStore)
        return accountStore;
    };

    useEffect(() =>{
        const dismissToast = (id) => {
            toast.dismiss(id);
        }
        const setUnverifiedWarning = () => {
            toast.warn(
                { 
                    duration: 1661,
                    approveFunc: dismissToast, 
                    dismissFunc: dismissToast,
                    message: "Thanks for signing up to use Animator. "+
                        "You'll need to verify your account to access some features. "+ 
                        "Check your email and follow the link to verify.",
                    dismissTxt: "OK", 
                    approveTxt: "Cool",
                    toastId: "unverified"
                }
            );
        }
        
        if(!isLoading && !accountStore.user){
            dispatch({
                type: 'CHECK_AUTH',
                data: {
                    isAuthenticated: isAuthenticated,
                    user: user
                }
            });
        }
        if(accountStore.user && accountStore.user.isAuth && !accountStore.user.isVerified){
            setUnverifiedWarning();
        }
    },[isLoading, isAuthenticated, user]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const setAccessToken = async (signal) => {
            dispatch({type: 'SET_ACCESS', data: await getAccessTokenSilently(signal), signal: signal})
        }
        if(isAuthenticated && accountStore.user && !accountStore.user.access){
            setAccessToken(signal);
        }
        return() => {
            controller.abort();
        }
    },[getAccessTokenSilently, isAuthenticated])

    useEffect(() => {
        if(isAuthenticated && state.user && state.user.access && !state.notices && !state.isSet ){
            getAccountInfo(state.user.userid, state.user.access)
            .then((result) => {
                if(result){
                    result.isSet = true;
                    dispatch({
                        type: 'SET_ACCOUNT_INFO',
                        data: result
                    });
                    if(window.location.href.indexOf('/home' > -1)){
                        toast.success({message: "Account data ready", duration: 1000, toastId: 'data_fetch'});
                    }
                }else{
                    dispatch({
                        type: 'SET_ACCOUNT_INFO',
                        data: {isSet: true}
                    });
                    handleFailedConnection(SITE.failed_retrieval_message, false, toast);
                }        
            });
        }else if(!isLoading && !isAuthenticated && !accountStore.isSet){
            dispatch({type: 'SET_ACCOUNT_INFO', data: {isSet: true}});
        }
    },[isLoading, isAuthenticated, getAccessTokenSilently, user, state.user, state.notices, state.isSet]);

    return [accountStore, dispatch];

}

export const useAccount = () => {

    const [account, setState] = useState({isSet: false});

    const [accountState, accountDispatch] = useAccountStore();

    useEffect(() => {
        setState(accountState)
    }, [accountState])
    return {account : account, dispatch : accountDispatch};
}