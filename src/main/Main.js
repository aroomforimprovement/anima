import React from 'react';
import { Switch, Route, Redirect, withRouter, useHistory } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Home from './Home';
import Login from '../common/Login';
import Logout from '../common/Logout';
import Create from './create/Create';
import Collection from './collection/Collection';
import Account from './account/Account';
import './main.scss';
import SmoothScroll from 'smoothscroll-for-websites/SmoothScroll.js';
import { ToastRack } from 'buttoned-toaster';
import { useAccount } from '../shared/account';
import { Loading } from '../common/Loading';
import { Help } from './help/Help';
import Messages from './messages/Messages';


const Main = () => {
    SmoothScroll({animationTime: 1000, stepSize: 10, accelerationDelta: 5});
    //const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const {history} = useHistory();
    const HomePage = () => { return <Home /> }
    const LoginPage = () => { return <Login /> }
    const LogoutPage = () => { return <Logout /> }
    const CreatePage = () => { return <Create />}
    const EditPage = () => { return <Create  />}
    const CollectionPage = () => { return <Collection browse={false} /> }
    const BrowsePage = () => { return <Collection browse={true} /> }
    const HelpPage = () => { return <Help />}
    const AccountPage = () => { return <Account />}
    const MessagesPage = () => { return <Messages />}

    
    const {account} = useAccount();

    //useEffect(() => {
    //    console.log("account")
    //    mainDispatch({type: 'SET_USER', data: account.user})
    //}, [account]);

    //useEffect(() => {
    //    console.dir(mainState)
    //}, [mainState])

    return (
        <div>
        {account && account.isSet ? 
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
                <Route path='/help' history={history} component={HelpPage} />
                <Route path='/messages' history={history} component={MessagesPage} />
                <Route path='/' history={history} component={HomePage} />
                <Redirect to='/login' history={history}/>
            </Switch>
            <Footer />
            <ToastRack />
        </div>         
        : <div><Loading message="Setting up..."/></div>
        }
        </div>
    );
}

export default withRouter(Main);