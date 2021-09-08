import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';

const store = ConfigureStore();

class App extends Component {
  render(){
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Auth0ProviderWithHistory>
              <div className='App'>
                <Main />
              </div>
          </Auth0ProviderWithHistory>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
