import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const LoginBtn = (props) => {
    const classes = `btn btn-secondary ${props.size} m-1`;
    
    const { loginWithPopup, user } = useAuth0();

    useEffect(() => {
        if(user){
            //window.location.href = '/login';
        }
    }, [user]);

    const loginPop = async () => {
        loginWithPopup().then(() => {
            //console.log('loginWithPopup, then...');
            console.log(user)
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
            onClick={() => logout({url})}
            type='button' 
            className={classes}>
                Log out
            </button>
                        
}

export const SignupBtn = (props) => {
    const classes = `btn btn-success ${props.size} m-1`;
    const { loginWithPopup, user } = useAuth0();
    
    useEffect(() => {
        if(user){
            //window.location.href = '/login'
        }
    }, [user])
    return <button
            onClick={() => loginWithPopup(
                {
                    screen_hint: 'signup'
                }
            ).then(() => {
                
            })}
            type='button'
            className={classes}
            >Sign up</button>

}

