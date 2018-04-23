import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

class Header extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <div className="navbar navbar-expand-sm bg-innroad navbar-dark">
                <div className="container">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="navbar-brand" to={'/'}>Test Session</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="navbar-brand" to={'/'}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="navbar-brand" to={'/manage-exam'}>Manage Exam</Link>
                        </li>
                    </ul>
                </div>

            </div>
        );
    }
}

export default Header;
