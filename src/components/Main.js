import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Home from './Home';


class Main extends Component {
    componentDidMount(){
        console.log("Main: componentDidMount");
    }

    render() {
        const HomePage = () => {
            return <Home />
        }

        return (
            <div>
                <Switch>
                    <Route path='/home' component={HomePage} />
                    <Redirect to='./home' />
                </Switch>
            </div>
        );
    }
}

export default withRouter(Main);