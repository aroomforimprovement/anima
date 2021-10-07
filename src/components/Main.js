import React, { createContext, useContext, useReducer } from 'react';
import { Switch, Route, Redirect, withRouter, useHistory } from 'react-router-dom';
import Header from './partials/Header';
import Footer from './partials/Footer';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Create from './Create';
import Collection from './Collection';
import Browse from './Browse';
import Account from './Account';
import { mainReducer } from '../redux/Main';
const MainContext = createContext({});

export const useMainContext = () => {
    return useContext(MainContext);
}

const Main = () => {


    const [mainState, mainDispatch] = useReducer(mainReducer, {});
    const stateOfMain = { mainState, mainDispatch };

    const {history} = useHistory();
    
    const HomePage = () => { return <Home /> }
    const LoginPage = () => { return <Login /> }
    const LogoutPage = () => { return <Logout /> }
    const CreatePage = () => { return <Create /> }
    const CollectionPage = () => { return <Collection /> }
    const BrowsePage = () => { return <Browse /> }
    const AccountPage = () => { return <Account />}

        
    return (
        <div>
            <MainContext.Provider value={stateOfMain}>
                <MainContext.Consumer>
                    {() => (
                    <div>
                        <Header />
                        <Switch>
                            <Route path='/home' history={history} component={HomePage} />
                            <Route path='/login' history={history} component={LoginPage} />
                            <Route path='/logout' history={history} component={LogoutPage} />
                            <Route path='/create' history={history} component={CreatePage} />
                            <Route path='/collection' history={history} component={CollectionPage} />
                            <Route path='/browse' history={history} component={BrowsePage} />
                            <Route path='/account' history={history} component={AccountPage} />
                            <Redirect to='/home' history={history}/>
                        </Switch>
                        <Footer />
                    </div>
                    )}
                </MainContext.Consumer>
            </MainContext.Provider>
        </div>
    );
}

export default withRouter(Main);