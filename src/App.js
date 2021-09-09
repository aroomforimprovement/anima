import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';


class App extends Component {
  render(){
    return (
        <BrowserRouter>
          <Auth0ProviderWithHistory>
              <div className='App'>
                <Main />
              </div>
          </Auth0ProviderWithHistory>
        </BrowserRouter>
    );
  }
}

export default App;
