import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import userReducer from './store/reducers/user.js';
import lobbyReducer from './store/reducers/lobby.js';
import miscReducer from './store/reducers/misc.js';
import reportWebVitals from './reportWebVitals';

const rootReducer = combineReducers({
  user: userReducer,
  lobby: lobbyReducer,
  misc: miscReducer
});

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const store = composeEnhancers != null
  ? createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
  : createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
