import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Switch, Route, Redirect, withRouter, useHistory } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Home from './Home';
import Login from '../common/Login';
import Logout from '../common/Logout';
import Create from './create/Create';
import Collection from './collection/Collection';
import Account from './account/Account';
import { mainReducer } from './mainReducer';
import { useAuth0 } from '@auth0/auth0-react';
import { getAccountInfo } from './account/accountReducer';
import './main.css';
import SmoothScroll from 'smoothscroll-for-websites/SmoothScroll.js';
import toast, { ToastRack } from 'buttoned-toaster';
import { SITE } from '../shared/site';
import { handleFailedConnection } from '../common/Toast';


const MainContext = createContext({});

export const useMainContext = () => {
    return useContext(MainContext);
}


const Main = () => {
    SmoothScroll({animationTime: 1000, stepSize: 10, accelerationDelta: 5});
    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [mainState, mainDispatch] = useReducer(mainReducer, {progressFrame: {max: 0, now: 0}});
    const stateOfMain = { mainState, mainDispatch };
    const {history} = useHistory();
    const HomePage = () => { return <Home /> }
    const LoginPage = () => { return <Login /> }
    const LogoutPage = () => { return <Logout /> }
    const CreatePage = () => { return <Create edit={false} loggingIn={mainState.loggingIn}/> }
    const EditPage = () => { return <Create edit={true} loggingIn={mainState.loggingIn}/>}
    const CollectionPage = () => { return <Collection browse={false} /> }
    const BrowsePage = () => { return <Collection browse={true} /> }
    const AccountPage = () => { return <Account />}

    

    useEffect(() =>{
        const dismissToast = (id) => {
            toast.dismiss(id);
        }
        const setUnverifiedWarning = () => {
            toast.warn(
                { 
                    duration: 1661,
                    approveFunc: dismissToast, 
                    dismissFunc: dismissToast,
                    message: "Thanks for signing up to use Animator. "+
                        "You'll need to verify your account to access some features. "+ 
                        "Check your email and follow the link to verify.",
                    dismissTxt: "OK", 
                    approveTxt: "Cool",
                    toastId: "unverified"
                }
            );
        }
        
        if(!isLoading && !mainState.user){
            mainDispatch({
                type: 'CHECK_AUTH',
                data: {
                    isAuthenticated: isAuthenticated,
                    user: user
                }
            });
        }
        if(mainState.user && mainState.user.isAuth && !mainState.user.isVerified){
            setUnverifiedWarning();
        }
    },[isLoading, mainState.user, isAuthenticated, user]);

    useEffect(() => {
        const setAccessToken = async () => {
            mainDispatch({type: 'SET_ACCESS', data: await getAccessTokenSilently()})
        }
        if(isAuthenticated && mainState.user && !mainState.user.access){
            setAccessToken();
        }
    },[getAccessTokenSilently, isAuthenticated, mainState.user])

    useEffect(() => {
        if(isAuthenticated && mainState.user && mainState.user.access && !mainState.notices && !mainState.isSet){
            getAccountInfo(mainState.user.userid, mainState.user.access)
                .then((result) => {
                    if(result){
                        result.isSet = true;
                        mainDispatch({
                            type: 'SET_ACCOUNT_INFO',
                            data: result
                        });
                        if(window.location.href.indexOf('/home' > -1)){
                            toast.success({message: "Account data ready", duration: 1000, toastId: 'data_fetch'});
                        }
                    }else{
                        mainDispatch({
                            type: 'SET_ACCOUNT_INFO',
                            data: {isSet: true}
                        });
                        handleFailedConnection(SITE.failed_retrieval_message, false, toast);
                    }
                    
                });

        }else if(!isLoading && !isAuthenticated && !mainState.isSet){
            mainDispatch({type: 'SET_ACCOUNT_INFO', data: {isSet: true}});
        }
    },[isLoading, isAuthenticated, getAccessTokenSilently, mainState.user, mainState.notices, mainState.isSet]);


        
    return (
        <div>
        {mainState && mainState.isSet ? 
        <div>
            <MainContext.Provider value={stateOfMain}>
                <MainContext.Consumer>
                    {() => (
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
                        <ToastRack />
                    </div>
                    )}
                </MainContext.Consumer>
            </MainContext.Provider>
        </div>
        : <div></div>
        }
        </div>
    );
}

export default withRouter(Main);