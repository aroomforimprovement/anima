import React, { useEffect, useReducer } from 'react';
import { Loading } from './Loading';
import { Redirect } from 'react-router';
import { useMainContext } from '../main/Main';
import { handleFailedConnection } from './Toast';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {

    const { mainState  } = useMainContext();

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
            handleFailedConnection();
            console.error(error)
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
            dispatch({type: 'setSaveFailed'});
        })
        .catch(error => {console.error(error)});
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
                //console.dir('setLogin: ', action.data);
                window.localStorage.setItem('userid', action.data.userid);
                window.localStorage.setItem('username', action.data.username);
                window.localStorage.setItem('email', action.data.email);
                return ({...state, login: action.data, isRegistered: true, isSending: false});
            }
            case 'setAnim':{
                let anim = action.data;
                anim.userid = mainState.user.userid;
                anim.username = mainState.user.username;
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
        console.log("useEffect: ");
        console.dir(mainState);
        const controller = new AbortController();
        const signal = controller.signal;

        
        const putLoginCall = async (login) => {
            await putLogin(login);
        }
        if(state.isFailed){
            handleFailedConnection();
        }
        if(!state.isRegistered && state.isLoaded && (mainState && mainState.user && mainState.user.access) && !state.isSending && !state.isFailed){
            dispatch({type: 'setIsSending', data: true});
            putLoginCall({ 
                userid: mainState.user.userid,
                email: mainState.user.email,
                username: mainState.user.name, access: mainState.user.access,
            }, signal).catch((error) => {console.error(error)});
        }
        return () => {
            //console.log("abort login");
            //controller.abort();
        }
    },[state.isLoaded, mainState, state.isSending, state.isFailed, state.isRegistered]);

    useEffect(() => {
        if(!state.isLoaded && mainState.isSet){
            dispatch({type: 'setIsLoaded', data: true});
        }       
    },[state.isLoaded, mainState.isSet]);

    useEffect(() => {
        console.log("useEffect state.anim:" + state.anim);
        console.log("useEffect state.isFailed:" + state.isFailed);
        console.log("useEffect state.isSaving:" + state.isSaving);
        console.log("useEffect state.isSaved:" + state.isSaved);
        console.log("useEffect mainState.user:" + mainState.user);
        const controller = new AbortController();
        const signal = controller.signal;

        const saveAnimToAccountCall = async (anim, access) => {
            await saveAnimToAccount(anim, access, signal).then(() => {
                dispatch({type: 'setIsSaved', data: true});
                dispatch({type: 'setIsSaving', data: false});
            }).catch((error) => {console.error(error);});
        }
        if(state.anim && !state.isSaved && !state.isSaving){
            saveAnimToAccountCall(state.anim, mainState.user.access, signal);
        }

        return () => {
            //console.log("abort save");
            //controller.abort();
        }
    }, [mainState.user, state.anim, state.isFailed, state.isSaved, state.isSaving]);

    if(state.isFailed){
        return(
            <Loading message={"Loading..."} />
        )
    }
    
    if(!mainState){
        return(
            <Loading message={"Loading authentication..."} />
        );
    }else if(state.isRegistered && mainState.user.userid && window.localStorage.getItem('tempAnim') && !state.isSaved){
            
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
    
    }else if(state.isRegistered && mainState.user.userid && !window.localStorage.getItem('tempAnim') && !state.isSaved && !state.anim && !state.isSaving){
    
        return(
           //<Loading message="redirect blocked" />
           <Redirect to='/create'/>
        );
    }else{
    
        return(
           <Loading/>
        );
    
    }
}

export default Login;