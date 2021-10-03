import React, { useState, useEffect } from 'react';
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

const Main = () => {
  
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
    );
}

export default withRouter(Main);