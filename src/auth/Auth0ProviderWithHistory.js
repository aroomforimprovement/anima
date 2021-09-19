import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';


const Auth0ProviderWithHistory = ({ children }) => {
    
    const domain = process.env.REACT_APP_AUTH_DOMAIN;
    const clientId = process.env.REACT_APP_AUTH_CLIENT_ID;
    const audience = process.env.REACT_APP_AUTH_AUDIENCE;
    const scope = process.env.REACT_APP_AUTH_SCOPE;

    const history = useHistory();
    const onRedirectCallback = (appState) => {
        history.push(appState?.returnTo || window.location.pathname);
    };

    return <Auth0Provider
            domain={domain}
            clientId={clientId}
            redirectUri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
            audience={audience}
            scope={scope}>
                    {children}
        </Auth0Provider>
}

export default Auth0ProviderWithHistory;