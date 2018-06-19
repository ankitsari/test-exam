import React, {Component} from 'react';
import {login, getToken} from "../../utils/_data";
import { notification } from "antd";
import { urlDomain } from "../../utils/common"


const callbackUrl = `${urlDomain}/login`;
//const callbackUrl = `http://localhost:3000/login`;

class Home extends Component {
  componentWillMount() {
    if (window.location && window.location.search && window.location.search.match("code")) {
      let code = window.location.search.split('&')[0].substr(6);
      getToken({code, callback: callbackUrl}).then(res => {
        const token = res && res.token;
        const refreshToken = res && res.refreshToken;
        const email = res && res.email;
        localStorage.setItem('exam-token', token);
        localStorage.setItem('exam-refreshToken', refreshToken);
        localStorage.setItem('exam-email', email);
        localStorage.setItem('exam-user', JSON.stringify(res));
        window.location.href = '/';
      }).catch(err => {
          notification.error({
              message: 'Something going wrong. please contact to administrator.',
              placement: 'topRight',
          })
        console.log(err)
      });
    }
  }

  loginOffice365 = () => {
    login(callbackUrl).then(res => {
      window.location.href = res;
    }).catch(err => {
        notification.error({
            message: 'Something going wrong. please contact to administrator.',
            placement: 'topRight',
        })
        console.log(err)
    });
  };

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-md-12">
            <button className="btn btn-primary mr-2" onClick={this.loginOffice365}>Login with Office365</button>
            <button className="btn btn-primary" onClick={this.loginOffice365}>Sign-up with Office365</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
