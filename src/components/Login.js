import React, { useEffect, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const apiUrl = process.env.REACT_APP_API_URL;

export const Login = () => {
    const putLogin = (login) => {
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
                console.dir(response);
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
        .then(response => dispatch({
            type: 'setRegistered', 
            data: response
        }))
        .catch(error => {
            dispatch({type: 'setFailed', data: true})
            console.log('PUT Login:' + error.message)
        });
    }

    const loginReducer = (state, action) => {
        switch(action.type){
            case 'setIsLoaded':{
                console.log('setIsLoading');
                return {...state, isLoaded: action.data};
            }
            case 'setIsSending':{
                console.log('setIsSending');
                return {...state, isSending: action.data};
            }
            case 'setIsRegistered':{
                console.log('setIsRegistered');
                return {...state, isRegistered: action.data};
            }
            case 'setIsFailed':{
                console.log('setIsFailed');
                return {...state, isFailed: action.data};
            }
            case 'putLogin':{
                console.log('putLogin');
                if(state.isSending){return;}
                const data = {
                    "userid": user.sub.replace('auth0|', ''),
                    "email": user.email,
                    "name": user.nickname 
                }
                putLogin(data);
                return {...state, isSending: true}
            }
            default:
                return state;
        }
    }
    const {user, isAuthenticated, isLoading} = useAuth0();
    const [login, dispatch] = useReducer(loginReducer, {
        isSending: false,
        isRegistered: false,
        isFailed: false,
        isLoaded: false,
        user: {},
        login: {}
    });

    useEffect(() => {
        console.log("Login: useEffect");
        if(!isLoading && isAuthenticated && user && !login.isLoaded){
            console.log("dispatch: isLoaded");
            dispatch({type: 'setIsLoaded', data: true});
            dispatch({type: 'putLogin', data: user})
        }
    }, [isLoading, user, isAuthenticated, login.isLoaded]);

    
    





    return(
        <div><h1>here</h1></div>
    )
}

