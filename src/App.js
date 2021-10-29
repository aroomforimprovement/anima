import React, { useEffect, useReducer, createContext, useContext } from 'react';
import './App.css';
import Main from './components/Main';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';
import { ErrorBoudary } from './utils/errorUtils';
import { useAuth0 } from '@auth0/auth0-react';
import { mainReducer } from './redux/Main';
import { getAccountInfo } from './redux/Account';

const MainContext = createContext({});

export const useMainContext = () => {
  return useContext(MainContext);
}
const App = () => {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [mainState, mainDispatch] = useReducer(mainReducer, {});
    const stateOfMain = { mainState, mainDispatch };

  useEffect(() => {
    const setAccessToken = async () => {
        mainDispatch({type: 'SET_ACCESS', data: await getAccessTokenSilently()})
    }

    if(!isLoading && !mainState.user){
        mainDispatch({
            type: 'CHECK_AUTH',
            data: {
                isAuthenticated: isAuthenticated,
                user: user
            }
        });
    }else if(isAuthenticated && mainState.user && !mainState.user.access){
        setAccessToken();
    }else if(isAuthenticated && mainState.user && mainState.user.access && !mainState.notices){
        getAccountInfo(mainState.user.userid, mainState.user.access)
            .then((result) => {
                result.isSet = true;
                mainDispatch({
                    type: 'SET_ACCOUNT_INFO',
                    data: result
                });
            });
    }else if(!isLoading && !isAuthenticated && !mainState.isSet){
        mainDispatch({type: 'SET_ACCOUNT_INFO', data: {isSet: true}});
    }
},[isLoading, isAuthenticated, user, getAccessTokenSilently, mainState.user, mainState.notices, mainState.isSet]);
  

    return (
      <ErrorBoudary>
        <BrowserRouter>
          <Auth0ProviderWithHistory>
            <MainContext.Provider value={stateOfMain}>
                <MainContext.Consumer>
                {() => (
                <div className='App'>
                  <Main className='main'/>
                </div>
                )}
                </MainContext.Consumer>
            </MainContext.Provider>
          </Auth0ProviderWithHistory>
        </BrowserRouter>
        </ErrorBoudary>
    );
}

export default App;
