import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';


class Main extends Component {
    componentDidMount(){
        console.log("Main: componentDidMount");
    }

    render() {
        const HomePage = () => {
            return <Home />
        }
        const LoginPage = () => {
            return <Login />
        }
        const LogoutPage = () => {
            return <Logout />
        }

        return (
            <div>
                <Switch>
                    <Route path='/home' component={HomePage} />
                    <Route path='/login' component={LoginPage} />
                    <Route path='/logout' component={LogoutPage} />
                    <Redirect to='./home' />
                </Switch>
            </div>
        );
    }
}

export default withRouter(Main);