import React, { useEffect, useReducer } from 'react';
import { Loading } from './Loading';
import { Redirect } from 'react-router';
import { handleFailedConnection } from './Toast';
import { SITE } from '../shared/site';
import { getUserJwt } from '../utils/utils';
import { useAccount } from '../shared/account';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {

    const {account} = useAccount();

    const putLogin = async (login, signal) => {
        return await fetch(`${apiUrl}login`, {
            method: 'POST',
            mode: 'cors',
            signal: signal,
            body: JSON.stringify(login),
            headers: {
                Authorization: `Bearer ${login.access}`,
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if(response.ok){ 
                dispatch(
                    {
                        type: 'setLogin', 
                        data: login
                    });
            }else{ 
                dispatch({type: 'setIsFailed', data: true});
                console.error("response not ok") }
        }, error => { 
            dispatch({type: 'setIsFailed', data: true});
            console.error("error fetching login");
         }
        )
        .catch(error => { 
            dispatch({type: 'setIsFailed', data: true});
            handleFailedConnection(SITE.failed_connection_message, true);
            console.error("Error fetching data: putLogin")
        });
    }

    const saveAnimToAccount = async (anim, access, signal) => {
        return await fetch(`${apiUrl}anim`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(anim),
            signal: signal,
            headers: {
                Authorization: `Bearer ${access}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.ok){
                //console.log("response ok");
                return response;
            }else{
                //console.log('response not ok');
            }
        }, error => {
            console.error('error saving anim');
            dispatch({type: 'setSaveFailed', signal: signal});
        })
        .catch(error => {console.error("Error fetching data: saveAnimToAccount")});
    }

    const loginReducer = (state, action) => {
        //console.log(action.type+':'+action.data);
        switch(action.type){
            case 'setIsLoaded':{
                return ({...state, isLoaded: action.data});
            }
            case 'setIsSending':{
                return ({...state, isSending: action.data});
            }
            case 'setIsRegistered':{
                return ({...state, isRegistered: action.data});
            }
            case 'setIsFailed':{
                return ({...state, isFailed: action.data, isSending: !action.data});
            }
            case 'setLogin':{
                getUserJwt(action.data.username, action.data.email, action.data.userid)
                    .then((userJwt) => {
                        window.localStorage.setItem('anima_user', userJwt);
                    }).catch((err) =>  console.error(err))
                return ({...state, login: action.data, isRegistered: true, isSending: false});
            }
            case 'setAnim':{
                let anim = action.data;
                anim.userid = account.user.userid;
                anim.username = account.user.username;
                return({...state, anim: action.data});
            }
            case 'setIsSaving':{
                return({...state, isSaving: action.data});
            }
            case 'setIsSaved':{
                return({...state, isSaved: action.data});
            }
            case 'setSaveFailed':{
                return({...state, isSaving: false, saveFailed: true});
            }
            case 'setTempAnimSaving':{
                return({...state, isSaving: true});
            }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(loginReducer, {
        isLoaded: false,
        isSending: false,
        isRegistered: false,
        isFailed: false,
        login: {},
        isSaved: false,
        isSaving: false,
        saveFailed: false,
        anim: false
    });

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        
        const putLoginCall = async (login) => {
            console.dir(login);
            await putLogin(login);
        }
        if(state.isFailed){
            handleFailedConnection(SITE.failed_connection_message, true);
        }
        if(!state.isRegistered && state.isLoaded 
            && (account.user && account.user.access ) 
            && !state.isSending && !state.isFailed){
            dispatch({type: 'setIsSending', data: true});
            console.dir(account.user)
            putLoginCall({ 
                userid: account.user.userid,
                email: account.user.email,
                username: account.user.username, 
                access: account.user.access,
            }, signal).catch((error) => {console.error("Error registering login")});
        }
        return () => {
            controller.abort();
        }
    },[state.isLoaded, state.isSending, state.isFailed, state.isRegistered, account.user]);

    useEffect(() => {
        if(!state.isLoaded && account.isSet){
            dispatch({type: 'setIsLoaded', data: true});
        }       
    },[state.isLoaded, account.isSet]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const saveAnimToAccountCall = async (anim, access) => {
            await saveAnimToAccount(anim, access, signal).then(() => {
                dispatch({type: 'setIsSaved', data: true, signal});
                dispatch({type: 'setIsSaving', data: false, signal});
            }).catch((error) => {console.error("Error saving Anim to account");});
        }
        if(state.anim && !state.isSaved && !state.isSaving){
            saveAnimToAccountCall(state.anim, account.user.access, signal);
        }

        return () => {
            //console.log("abort save");
            controller.abort();
        }
    }, [account.user, state.anim, state.isFailed, state.isSaved, state.isSaving]);

    if(state.isFailed){
        return(
            <Loading message={"Loading..."} />
        )
    }
    
    if(!account){
        return(
            <Loading message={"Loading authentication..."} />
        );
    }else if(state.isRegistered && account.user.userid && window.localStorage.getItem('tempAnim') && !state.isSaved){
            
            dispatch({type: 'setAnim', data: JSON.parse(window.localStorage.getItem('tempAnim')).anim});
            window.localStorage.removeItem('tempAnim');
            return <Loading message={"Saving your animation...1"} />
    }else if(state.anim && !state.isSaving && !state.isSaved){
        
        //dispatch({type: 'setTempAnimSaving', data: state.anim});
        return <Loading message={"Saving your animation...2"} />
    
    }else if(state.anim && !state.isSaved){
    
        return <Loading message={"Saving your animation...3"} />
    
    }else if(state.isSaved && !state.isSaving){
    
        const animid = state.anim.animid;
        return(
            //<Loading message="redirect blocked" />
            <Redirect to={`/create/${animid}`} />
        );
    
    }else if(state.isRegistered && account.user.userid && !window.localStorage.getItem('tempAnim') && !state.isSaved && !state.anim && !state.isSaving){
    
        return(
           //<Loading message="redirect blocked" />
           <Redirect to='/create'/>
        );
    }else{
    
        return(
           <Loading message="oh dear"/>
        );
    
    }
}

export default Login;