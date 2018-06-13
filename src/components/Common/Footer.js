import React, {Component} from 'react';
import './Footer.css';

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="container mt-5">
        <footer>
          <p className="text-left">© 2018 - Practical Test</p>
        </footer>
      </div>
    );
  }
}

export default Footer;
