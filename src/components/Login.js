import React, { useEffect, useReducer } from 'react';
import { Loading } from './partials/Loading';
import { Problem } from './partials/Problem';
import { Redirect } from 'react-router';
import { useMainContext } from './Main';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {

    const { mainState  } = useMainContext();

    const putLogin = (login) => {
        console.log('putLogin');
        //console.dir(login);
        console.log(login.access);
        return fetch(`${apiUrl}login`, {
            method: 'POST',
            mode: 'cors',
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
            console.error(error)
        });
    }

    const saveAnimToAccount = (anim, access) => {
        return fetch(`${apiUrl}anim`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(anim),
            headers: {
                Authorization: `Bearer ${access}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.ok){
                console.log('anim saved ok ' + response.json);
                dispatch({type: 'setIsSaved', data: true});
                dispatch({type: 'setIsSaving', data: false});
                
            }else{
                console.log('response not ok');
            }
        }, error => {
            console.error('error saving anim');
            dispatch({type: 'setSaveFailed'});
        })
        .catch(error => {console.error(error)});
    }

    const loginReducer = (state, action) => {
        console.log(action.type+':'+action.data);
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
            case 'putLogin':{
                putLogin(action.data);
                return state;
            }
            case 'setLogin':{
                console.dir('setLogin: ', action.data);
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
            case 'setTempAnimSaved':{
                saveAnimToAccount(action.data, mainState.user.access);
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
        console.log("Login: useEffect");
        console.log('isSending: ' + state.isSending);
        console.log('isRegistered: ' + state.isRegistered);
        console.log('isFailed: ' + state.isFailed);
        console.log('isSaved: ' + state.isSaved);
        console.log('isSaving: ' + state.isSaving);
        console.dir('anim: ' + state.anim);
        if(state.isRegistered){
            return;
        }
        if(!mainState){
            return;
        }else if(!state.isLoaded){
            dispatch({type: 'setIsLoaded', data: true});
        }else if(state.isLoaded && (mainState && mainState.user && mainState.user.isAuth && mainState.user.access) &&  !state.isSending && !state.isFailed){
            console.dir('useEffect, user: ', mainState.user);
            dispatch({type: 'setIsSending', data: true});
            dispatch({type: 'putLogin', data: { 
                userid: mainState.user.userid,
                email: mainState.user.email,
                username: mainState.user.nickname, access: mainState.user.access
            }});
        }
        if(state.anim && !state.isSaved && !state.isSaving){
            console.log("trying to get here");
            dispatch({type: 'setTempAnimSaved', data: state.anim});
        }
    }, [mainState, state.anim, state.isFailed, state.isLoaded, state.isRegistered, state.isSending, state.isSaving, state.isSaved]);
    
    if(!mainState){
        return(
            <Loading message={"Loading authentication..."} />
        );
    }else if(state.isSending && !state.isFailed && !state.isRegistered){
        return(
            <Loading message={"Registering login..."} />
        );
    }else if(state.isFailed){
        return(
            <Problem message={"It looks like there was a problem with your login"} />
        );
    }else if(state.isRegistered && mainState.user.userid && window.localStorage.getItem('tempAnim') && !state.isSaved){
        dispatch({type: 'setAnim', data: JSON.parse(window.localStorage.getItem('tempAnim')).anim});
        window.localStorage.removeItem('tempAnim');
        return <Loading message={"Saving your animation..."} />
    }else if(state.anim && !state.isSaving){
        dispatch({type: 'setTempAnimSaved', data: state.anim});
        return <Loading message={"Saving your animation..."} />
    }else if(state.anim && !state.isSaved){
        return <Loading message={"Saving your animation..."} />
    }else if(state.isSaved){
        const animid = state.anim.animid;
        return(
            <Redirect to={`/create/${animid}`} />
        );
    }else if(state.isRegistered && mainState.user.userid && !window.localStorage.getItem('tempAnim') && !state.isSaved && !state.anim && !state.isSaving){
        return(
            <Loading message="redirect blocked" />
           // <Redirect to='/create'/>
        );
    }
    return(
        <Loading message={"Getting you all set up..."} />
    )
}

export default Login;