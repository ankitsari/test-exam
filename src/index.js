import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux'
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import App from './App'
import store from './Redux/store'
import './index.css';

render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" component={App}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
)
