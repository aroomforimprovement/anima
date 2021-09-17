import React, { useEffect, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from './partials/Loading';
import { Problem } from './partials/Problem';
import { Redirect } from 'react-router';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {

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
            if(response.ok){ return response;
            }else{ 
                dispatch({type: 'setIsFailed', data: true});
                console.error("response not ok") }
        }, error => { 
            dispatch({type: 'setIsFailed', data: true});
            console.error("error fetching login");
         }
        )
        .then(response => response.json())
        .then(response => {   
            dispatch(
            {
                type: 'setLogin', 
                data: login
            })
        }
        ).catch(error => { console.error(error)})
        .finally(response =>{ 
            dispatch({type: 'setIsRegistered', data: true})
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
                putLogin(action.data);
                return state;
            }
            case 'setLogin':{
                console.dir('setLogin: ', action.data);
                localStorage.setItem('userid', action.data.userid);
                localStorage.setItem('username', action.data.username);
                localStorage.setItem('email', action.data.email);
                localStorage.setItem('isAuth', true);
                return ({...state, login: action.data, isRegistered: true});
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
            console.dir('useEffect, user: ', user);
            dispatch({type: 'setIsSending', data: true});
            dispatch({type: 'putLogin', data: { 
                userid: user.sub.replace('auth0|', ''),
                email: user.email,
                username: user.nickname
            }});
        }
    }, [isLoading, user, isAuthenticated, state.isLoaded, 
        state.isSending, state.isRegistered, state.isFailed]);
    
    if(isLoading){
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
    }else if(state.isRegistered && localStorage.getItem('userid')){
        return(
           // <Loading message="redirect blocked" />
            <Redirect to='/'/>
        );
    }
    return(
        <Loading message={"Something something..."} />
    )
}

export default Login;