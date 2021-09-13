import React from 'react';
import { Switch, Route, Redirect, withRouter, useHistory } from 'react-router-dom';
import Header from './partials/Header';
import Footer from './partials/Footer';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Create from './Create';
import Collection from './Collection';
import Browse from './Browse';
import { useAuth0 } from '@auth0/auth0-react';

const Main = () => {
    
        const { isAuthenticated } = useAuth0();
        let history = useHistory();

        const HomePage = () => { return <Home /> }
        const LoginPage = () => { return <Login /> }
        const LogoutPage = () => { return <Logout /> }
        const CreatePage = () => { return <Create /> }
        const CollectionPage = () => { return <Collection /> }
        const BrowsePage = () => { return <Browse /> }
        
        
        return (
            <div>
                <Header isAuthenticated={isAuthenticated}/>
                <Switch>
                    <Route path='/home' history={history} component={HomePage} />
                    <Route path='/login' history={history} component={LoginPage} />
                    <Route path='/logout' history={history} component={LogoutPage} />
                    <Route exact path='/create' history={history} component={CreatePage} />
                    <Route path='/collection' history={history} component={CollectionPage} />
                    <Route path='/browse' history={history} component={BrowsePage} />
                    
                    <Redirect to='./home' />
                </Switch>
                <Footer />
            </div>
        );
}

export default withRouter(Main);