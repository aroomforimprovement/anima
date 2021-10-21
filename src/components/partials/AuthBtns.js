import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router';

export const LoginBtn = (props) => {
    const classes = `btn btn-secondary ${props.size} m-1`;
    const url = `${process.env.REACT_APP_URL}/login`;
    
    const { loginWithPopup } = useAuth0();

    const loginPop = async () => {
        loginWithPopup().then(() => {
            console.log('loginWithPopup, then...');
            window.location.href = '/login';
        });
    }
    return <button 
            onClick={() => loginPop()}
            type='button' 
            className={classes}
            >Login</button>
               
}

export const LogoutBtn = (props) => {
    const classes = `btn btn-secondary ${props.size} m-1`;
    const url = `${process.env.REACT_APP_URL}/logout`;
    const { logout } = useAuth0();
    return <button 
            onClick={() => logout({/*returnTo: url*/}).then((a, b) => {
                console.log("logout, then");
                console.dir(a);
                console.dir(b);
            })}
            type='button' 
            className={classes}>
                Log out
            </button>
                        
}

export const SignupBtn = (props) => {
    const classes = `btn btn-success ${props.size} m-1`;
    const { loginWithPopup } = useAuth0();
    return <button
            onClick={() => loginWithPopup(
                {
                    screen_hint: 'signup'
                }
            ).then(() => {window.location.href = '/login'})}
            type='button'
            className={classes}
            >Sign up</button>

}

