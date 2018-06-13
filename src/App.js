import React, {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom'
import {getUserInfo} from "./utils/_data";
import utils from './utils'
import Session from './components/Session';
import Create from './components/Session/action/Create';
import Edit from './components/Session/action/Edit';
import ManageExamination from './components/ManageExamination';
import View from './components/Session/action/View';
import TakeTest from './components/Session/test/TakeTest';
import TechnicalTest from './components/Session/test/TechnicalTest';
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
import Home from "./components/Home/index";

class App extends Component {
  componentWillMount() {
    const code = utils.getCookie('code');
    if (code && !localStorage.getItem('user')) {
      getUserInfo({code}).then(res => {
        if (res && res.FirstName) {
          localStorage.setItem('user', res);
        }
      }).catch(err => console.log(err));
    }
  }

  render() {
    return (
      <div>
        <Header/>
        <div className="container">
          {
            localStorage.getItem('exam-token') ?
              <Switch>
                <Route exact path="/session/create" component={Create}/>
                <Route exact path="/session/edit/:id" component={Edit}/>
                <Route exact path="/session/view/:testId" component={View}/>
                <Route exact path="/ValidateToken/:token" component={TakeTest}/>
                <Route exact path="/TechnicalTest/TestStart" component={TechnicalTest}/>
                <Route exact path="/manage-exam" component={ManageExamination}/>
                <Route exact path="/manage-exam/edit/:testId" component={ManageExamination}/>
                <Route path="/" component={Session}/>
                <Route path="*" render={() => <Redirect to="/"/>}/>
              </Switch>
              :
              <Switch>
                <Route exact path="/login" component={Home}/>
                <Route path="*" render={() => <Redirect to="/login"/>}/>
              </Switch>
          }
        </div>
        <Footer/>
      </div>
    )
  }
}

export default App;