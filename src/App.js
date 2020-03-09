import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import './App.css';
import MainComponent from './components/maincomponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';


const store = ConfigureStore();

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <MainComponent />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}


export default App;
