import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const LoginBtn = (props) => {
    const classes = `btn btn-secondary ${props.size} m-1`;
    const url = `${process.env.REACT_APP_URL}login`;
    
    const { loginWithPopup } = useAuth0();

    const loginPop = async () => {
        loginWithPopup(
            {redirectUri: url}
            );
    }
    return <button 
            onClick={() => loginPop()}
            type='button' 
            className={classes}
            >Login</button>

    /**
    const { loginWithRedirect } = useAuth0();
    return <button 
            onClick={() => loginWithRedirect(
                {redirectUri: url}
            )}
            type='button' 
            className={classes}
            >Login</button>
      */                   
}

export const LogoutBtn = (props) => {
    const classes = `btn btn-outline-secondary ${props.size} m-1`;
    const url = `${process.env.REACT_APP_URL}logout`;
    const { logout } = useAuth0();
    return <button 
            onClick={() => logout({returnTo: url})}
            type='button' 
            className={classes}>
                Log out
            </button>
                        
}

export const SignupBtn = (props) => {
    const classes = `btn btn-success ${props.size} m-1`;
    const url = `${process.env.REACT_APP_URL}login`;
    const { loginWithRedirect } = useAuth0();
    return <button
            onClick={() => loginWithRedirect(
                {screen_hint: 'signup',
                redirectUri: url}
            )}
            type='button'
            className={classes}
            >Sign up</button>

}
