import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap4-modal';

class TakeTestModal extends Component {
    constructor(props) {
        super(props);
        this.state ={
        }
    }

    render() {;
        return (
            <Modal visible={this.props.show}>
                <div className="modal-header">
                    <h5 className="modal-title">Start Techincal Test</h5>
                    <button type="button" className="close" data-dismiss="modal" onClick={this.props.handleModal}>×</button>
                </div>
                <div className="modal-body">
                    <p style={{fontSize: 15}}>Once you start taking the test your start time will be logged, are you sure you are ready to start or do you need more time?</p>
                </div>
                <div className="modal-footer">
                    <Link  to={{ pathname: '/TechnicalTest/TestStart', state: { examDetailId: this.props.ExamDetailId }}}  className="btn btn-primary btn-sm" >
                        Ready to start
                    </Link>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={this.props.handleModal}>
                        Need more time
                    </button>
                </div>
            </Modal>
        );
    }
}
export default TakeTestModal
