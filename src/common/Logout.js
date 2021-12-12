import React, { useEffect, useReducer } from 'react';
import { Loading } from './Loading';
import { Problem } from './Problem';
import { Redirect } from 'react-router';
import { useMainContext } from '../main/Main';

const apiUrl = process.env.REACT_APP_API_URL

const Logout = () => {

    const {mainState} = useMainContext();

    const putLogout = async (signal) => {
        //console.log('putLogout');
        const userid = localStorage.getItem('userid');
        const email = localStorage.getItem('email');
        const username = localStorage.getItem('username');
        const logout = {userid: userid, email: email, username: username};
        return await fetch(`${apiUrl}logout`, {
            method: 'POST',
            mode: 'cors',
            signal: signal,
            body: JSON.stringify(logout),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if(response.ok){ 
                return response;
            }else{ console.error("response not ok") }
        }, error => { 
            console.error(error);
        }
        ).catch(error => { console.error(error) });
    }

    const logoutReducer = (state, action) => {
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
                return ({...state, isFailed: action.data});
            }
            case 'setLogout':{
                localStorage.removeItem('userid');
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                return ({...state, logout: action.data});
            }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(logoutReducer, {
        isLoaded: false,
        isSending: false,
        isRegistered: false,
        isFailed: false,
        user: null,
        logout: {},
    });
    
 
    useEffect(() => {
        //console.log('mount');
        const controller = new AbortController();
        const signal = controller.signal;
        const putLogoutCall = async (signal) => {
            await putLogout(signal).then((response) => {
                //console.log("then");
                if(response){
                    dispatch({type: 'setLogout', data: response});
                    dispatch({type: 'setIsRegistered', data: true});
                    dispatch({type: 'setIsSending', data: false});    
                }else{
                    dispatch({type: 'setIsSending', data: false});
                }
            }).catch((error) => {console.error(error);});
        }
        if(state.isLoaded && !state.isRegistered && !state.isFailed && !state.isSending){
            putLogoutCall(signal)
        }
        return () => {
            //console.log("abort");
            controller.abort();
        }
    },[state.isLoaded, state.isFailed, state.isSending, state.isRegistered]);

    useEffect(() => {
        if(!state.isLoaded && mainState.isSet){
            dispatch({type: 'setIsLoaded', data: true});
        }
    }, [state.isLoaded, mainState.isSet]);

    useEffect(() => {
        if(!state.isRegistered && state.isFailed && state.isSending){
            dispatch({type: 'setIsRegistered', data: true});
            dispatch({type: 'setIsSending', data: false});
        }
    }, [state.isRegistered, state.isFailed, state.isSending]);

    if(!mainState.isSet){
        return(
            <Loading message={"Loading..."} />
        );
    }else if(state.isSending && !state.isFailed && !state.isRegistered){
        return(
            <Loading message={"Registering logout..."} />
        );
    }else if(state.isFailed){
        return(
            <Problem message={"It looks like there was a problem logging you out"} />
        );
    }else if(state.isRegistered){
        return(
            //<Loading message={"Redirect blocked..."} />
            <Redirect to='/'/>
        );
    }
    return(
        <Loading message={"Something something..."} />
    );
}

export default Logout;