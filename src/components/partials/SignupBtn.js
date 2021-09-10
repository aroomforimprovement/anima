import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SignupBtn = (props) => {
    const classes = `btn btn-outline-secondary ${props.size} m-1`;
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

export default SignupBtn;