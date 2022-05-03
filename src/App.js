import React, { Component } from 'react';
import './App.scss';
import Main from './main/Main';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';
import { ErrorBoudary } from './utils/errorUtils';

class App extends Component {  
  
  render(){
    return (
      <ErrorBoudary>
        <BrowserRouter>
          <Auth0ProviderWithHistory>
              <div className='App'>
                <Main className='main'/>
              </div>
          </Auth0ProviderWithHistory>
        </BrowserRouter>
        </ErrorBoudary>
    );
  }
}

export default App;
