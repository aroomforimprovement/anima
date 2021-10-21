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
                return ({...state, login: action.data, isRegistered: true});
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
    });
    

    useEffect(() => {
        console.log("Login: useEffect");
        console.log('isSending: ' + state.isSending);
        console.log('isRegistered: ' + state.isRegistered);
        console.log('isFailed: ' + state.isFailed);
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
    }, [mainState, state.isFailed, state.isLoaded, state.isRegistered, state.isSending]);
    
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
    }else if(state.isRegistered && mainState.user.userid){
        return(
           // <Loading message="redirect blocked" />
            <Redirect to='/create'/>
        );
    }
    return(
        <Loading message={"Something something..."} />
    )
}

export default Login;