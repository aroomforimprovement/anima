import React from 'react';
import { Switch, Route, Redirect, withRouter, useHistory } from 'react-router-dom';
import Header from './partials/Header';
import Footer from './partials/Footer';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Create from './Create';
import Collection from './Collection';
import Account from './Account';
import { useMainContext } from '../App';

const Main = () => {

    const {mainState } = useMainContext();

    const {history} = useHistory();
    
    const HomePage = () => { return <Home /> }
    const LoginPage = () => { return <Login /> }
    const LogoutPage = () => { return <Logout /> }
    const CreatePage = () => { return <Create edit={false} /> }
    const EditPage = () => { return <Create edit={true} />}
    const CollectionPage = () => { return <Collection browse={false}/> }
    const BrowsePage = () => { return <Collection browse={true} /> }
    const AccountPage = () => { return <Account />}

    return (
        <div>
            {//mainState.isSet ?
            <div>
                
                    <div>
                        <Header />
                        <Switch>
                            <Route path='/account' history={history} component={AccountPage} />
                            <Route path='/browse' history={history} component={BrowsePage} />
                            <Route path='/collection/*' history={history} component={CollectionPage} />
                            <Route path='/collection' history={history} component={BrowsePage} />
                            <Route path='/create/*' history={history} component={EditPage} />
                            <Route path='/create' history={history} component={CreatePage} />
                            <Route path='/home' history={history} component={HomePage} />
                            <Route path='/login' history={history} component={LoginPage} />
                            <Route path='/logout' history={history} component={LogoutPage} />
                            <Route path='/' history={history} component={HomePage} />
                            <Redirect to='/home' history={history}/>
                        </Switch>
                        <Footer />
                        
                    </div>
                
            </div>
            //: <div></div>
        }
        </div>
    );
}

export default withRouter(Main);