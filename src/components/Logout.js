import React, { useEffect, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from './partials/Loading';
import { Problem } from './partials/Problem';
import { Redirect } from 'react-router';

const apiUrl = process.env.REACT_APP_API_URL

const Logout = () => {
    //return(<Redirect to='/'/>);
    const putLogout = (logout) => {
        console.log('putLogout');
        return fetch(`${apiUrl}logout`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(logout),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if(response.ok){ return response;
            }else{ console.error("response not ok") }
        }, error => { console.error(error) }
        )
        .then(response => response.json())
        .catch(error => { console.log(error) })
        .finally(response =>{ 
            dispatch({type: 'setLogout', data: response});
            dispatch({type: 'setIsRegistered', data: true})
        });
    }

    const logoutReducer = (state, action) => {
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
            case 'putLogout':{               
                putLogout(action.data);
                return state;
            }
            case 'setLogout':{
                localStorage.removeItem('userid');
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                localStorage.removeItem('isAuth');
                return ({...state, user: {}, logout: action.data});
            }
            case 'setUser':{
                const u = {
                    userid: localStorage.getItem('userid'),
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email')
                };
                return ({...state, user: u});
            }
            default:
                return state;
        }
    }

    const { isAuthenticated, isLoading } = useAuth0()
    const [state, dispatch] = useReducer(logoutReducer, {
        isLoaded: false,
        isSending: false,
        isRegistered: false,
        isFailed: false,
        user: null,
        logout: {},
    });
    

    useEffect(() => {
        console.log("Logout: useEffect");
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
            dispatch({type: 'setUser'})
        }else if(state.isLoaded && isAuthenticated){
            console.error("shouldn't get here! still authenticated after logout");
        }else if(state.isLoaded && !isAuthenticated && !state.isSending 
                    && !state.isFailed && state.user){
            dispatch({type: 'setIsSending', data: true});
            dispatch({type: 'putLogout', data: { 
                userid: state.user.userid,
                email: state.user.email,
                username: state.user.username
            }});
        }
    }, [isLoading, state.user, isAuthenticated, state.isLoaded, 
        state.isSending, state.isRegistered, state.isFailed]);

        if(isLoading){
            return(
                <Loading message={"Loading authentication..."} />
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
                <Redirect to='/'/>
            );
        }
        return(
            <Loading message={"Something something..."} />
        )
}

export default Logout;