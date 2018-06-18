import React from 'react';
import {logout} from "../../utils/_data";
import './Header.css';
import { withRouter } from 'react-router-dom';

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pathname: '',
      user: {},
    }
  }

  componentWillMount() {
    let {user} = this.state;
    const pathname = window.location.pathname;
    const examUser = localStorage.getItem('exam-user') && JSON.parse(localStorage.getItem('exam-user'));
    user = examUser || user
    if (pathname) {
      this.setState({
        pathname,
        user
      })
    }
  }

  onClick = (pathname) => {
    // if (pathname !== this.state.pathname) {
    //   this.setState({
    //     pathname,
    //   })
    //   window.location.href = pathname
    // }
      this.setState({
          pathname,
      })
     this.props.history.push(pathname)
  }

  render() {
    const {pathname, user} = this.state;
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" onClick={() => this.onClick('/')}>Test Session</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>

        {localStorage.getItem('exam-token') ? <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item ${pathname === '/' && 'active' }`}>
              <a className="nav-link" onClick={() => this.onClick('/')}>Home</a>
            </li>
            <li className={`nav-item ${pathname === '/manage-exam' && 'active' }`}>
              <a className="nav-link" onClick={() => this.onClick('/manage-exam')}>Manage Exam</a>
            </li>
            <li className={`nav-item ${pathname === '/manage-status' && 'active' }`}>
              <a className="nav-link" onClick={() => this.onClick('/manage-status')}>Manage Status</a>
            </li>
          </ul>
          <ul className="navbar-nav mr-0 pull-right">
            <li className={`nav-item`}>
              <a className="nav-link">Hello {user.first_Name}!</a>
            </li>
            <li className={`nav-item`}>
              <a className="nav-link" onClick={logout}>Log off</a>
            </li>
          </ul>
        </div> : null
        }
      </nav>
    );
  }
}

export default withRouter(Header);
