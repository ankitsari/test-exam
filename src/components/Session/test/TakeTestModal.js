import React, {Component} from 'react';
import { Link } from 'react-router-dom';
//import Modal from 'react-bootstrap4-modal';
import { Modal, Button } from 'react-bootstrap';

class TakeTestModal extends Component {
    constructor(props) {
        super(props);
        this.state ={
        }
    }

    render() {
        return (
        <Modal show={this.props.show} onHide={this.props.handleModal} bsSize={"small"}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Start Technical Test
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-body">
                    <p style={{fontSize: 15}}>Once you start taking the test your start time will be logged, are you sure you are ready to start or do you need more time?</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                    <Link  to={{ pathname: '/TechnicalTest/TestStart', state: { examDetailId: this.props.ExamDetailId }}}  className="btn btn-primary btn-sm" >
                        Ready to start
                    </Link>
                <Button type="button" className="btn btn-secondary btn-sm" onClick={this.props.handleModal}>
                        Need more time
                </Button>
            </Modal.Footer>
            </Modal>
        );
    }
}
export default TakeTestModal
