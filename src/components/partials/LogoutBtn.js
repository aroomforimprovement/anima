import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutBtn = (props) => {
    const classes = `btn btn-outline-secondary ${props.size} m-1`
    const { logout } = useAuth0();
    return <button 
            onClick={() => logout({returnTo: window.location.origin})}
            type='button' 
            className={classes}
            >Log out</button>
                        
}

export default LogoutBtn;