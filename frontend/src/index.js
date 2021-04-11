import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {usePromiseTracker} from 'react-promise-tracker'
import Loader from 'react-loader-spinner';

import { reducers } from './reducers';
import App from './App';
import './index.css';

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
  promiseInProgress &&
  <div style={{
  width: "100%",
  height: "100",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
  }}
  >
  <div style={{margin: '3rem'}} >
  <Loader type="TailSpin" color="#000000" height="100" width="100" />
  </div>
  </div>
  );  
}

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App />
    <LoadingIndicator/>
  </Provider>,
  document.getElementById('root')
);
