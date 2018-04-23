import React, {Component} from 'react';
import Modal from 'react-bootstrap4-modal';


class ExamModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal visible={true}>
                <div className="modal-header">
                    <h5 className="modal-title">Create</h5>
                </div>
                <div className="modal-body">
                    <div className="form-horizontal" >
                        <div className="form-group row">
                            <label className="col-md-3 col-form-label">Test Title</label>
                            <div className="col-md-8">
                                <input type="text"
                                       name="firstName"
                                       className="form-control"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-3 col-form-label">Hide Copy Paste Textbox</label>
                            <div className="col-md-8">
                                <input type="text"
                                       name="firstName"
                                       className="form-control"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-3 col-form-label">Description</label>
                            <div className="col-md-8">

                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" >
                        close
                    </button>
                    <button type="button" className="btn btn-primary" >
                        Save
                    </button>
                </div>
            </Modal>
        );
    }
}
export default ExamModal
