import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Logout = () => {
    const { user, isAuthenticated, isLoading } = useAuth0()

    if(isLoading){
        return <div>Loading...</div>;
    }
    console.dir(user);
    return(
        !isAuthenticated && (
            <div>
                <h1>{user.name}</h1>
            </div>
        )
    )
}

export default Logout;