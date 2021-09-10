import React, { useEffect, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const apiUrl = process.env.REACT_APP_API_URL;

export const Login = () => {
    const putLogin = (login) => {
        console.log('putLogin'); 
        return fetch(`${apiUrl}login`, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(login),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            console.log("then");
            if(response.ok){
                console.log("response ok");
                dispatch({
                    type: 'setIsRegistered', 
                    data: true
                })
                return response;
            }else{
                var error = new Error('Error:'+
                    response.status+':'+response.statusText);
                    error.response = response;
                    throw error;
            }
        }, error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => console.log("redirect, I guess", response))
        .catch(error => {
            dispatch({type: 'setIsFailed', data: true});
            console.log('PUT Login:' + error.message);
        });
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
                return ({...state, isFailed: action.data});
            }
            case 'putLogin':{               
                const data = {
                    "userid": user.sub.replace('auth0|', ''),
                    "email": user.email,
                    "name": user.nickname 
                }
                putLogin(data);
                return ({...state, isRegistered: true});
                
            }
            default:
                return state;
        }
    }
    const {user, isAuthenticated, isLoading} = useAuth0();
    const [state, dispatch] = useReducer(loginReducer, {
        isLoaded: false,
        isSending: false,
        isRegistered: false,
        isFailed: false,
        user: {},
        login: {},
    });
    useEffect(() => {
        console.log("Login: useEffect");
        console.log('isSending: ' + state.isSending);
        console.log('isRegistered: ' + state.isRegistered);
        console.log('isFailed: ' + state.isFailed);
        if(state.isRegistered){
            return;
        }
        if(isLoading){
            return;
        }else if(!state.isLoaded){
            dispatch({type: 'setIsLoaded', data: true});
        }else if(state.isLoaded && isAuthenticated && user &&  !state.isSending && !state.isFailed){
            dispatch({type: 'setIsSending', data: true});
            dispatch({type: 'putLogin', data: user});
        }
    }, [isLoading, user, isAuthenticated, state.isLoaded, 
        state.isSending, state.isRegistered, state.isFailed]);

    return(
        <div><h1>here</h1></div>
    )
}

