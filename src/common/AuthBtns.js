import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useToastRack } from 'buttoned-toaster';

const loginPop = async (loginWithPopup, screenHint, toast) => {
        
    const doLogin = (t) => {
        t ? toast.dismiss(t) : console.debug();
        loginWithPopup({screen_hint: screenHint});
    }
    const dismiss = (t) => {
        toast.dismiss(t);
    }
    window.location.href.indexOf('/create') > -1
    ?
    toast.fire(
        { 
            message: `If you log in now, you will lose any unsaved changes in your animation.
             Click cancel to go back and save your work. Click OK to proceed without saving`,
            approveFunc: doLogin,
            dismissFunc: dismiss,
            dismissTxt: "Cancel", 
            approveTxt: "OK",
        }
    ) :     
    doLogin();
}

export const LoginBtn = ({size}) => {
    const classes = `btn btn-secondary ${size} m-1`;
    const { loginWithPopup, user } = useAuth0();
    const toast = useToastRack();

    useEffect(() => {
        if(user){
            window.location.href = '/login';
        }
    }, [user]);

    return <button 
            onClick={() => loginPop(loginWithPopup, 'login', toast)}
            type='button' 
            className={classes}
            >Login</button>
               
}

export const LogoutBtn = (props) => {
    const classes = `btn btn-secondary ${props.size} m-1`;
    const url = `${process.env.REACT_APP_URL}/logout`;
    const { logout } = useAuth0();

    const handleLogout = () => {
        logout({url});
        localStorage.removeItem('anima_user');
    }
    return <button 
            onClick={() => handleLogout()}
            type='button' 
            className={classes}>
                Log out
            </button>
                        
}

export const SignupBtn = (props) => {
    const classes = `btn btn-success ${props.size} m-1`;
    const { loginWithPopup } = useAuth0();
    const toast = useToastRack();

    return <button
            onClick={() => loginPop(loginWithPopup, 'signup', toast)}
            type='button'
            className={classes}
            >Sign up</button>
}

