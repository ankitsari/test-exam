import React from 'react';
//import Modal from 'react-bootstrap4-modal';
import { Modal, Button } from 'react-bootstrap';

const ExamStatusModal = ({handleModal, onChange, errors, state, saveExam}) =>  (
  <Modal show={state.isModal} onHide={handleModal} bsSize={"small"}>
    <Modal.Header closeButton>
      <Modal.Title>
        Create/Update Status
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="form-horizontal">
        <div className="form-group row">
          <label className="col-md-3 col-form-label">Status</label>
          <div className="col-md-9">
            <input type="text" name="name" value={state.name} onChange={onChange} className="form-control"/>
            {state.name.length <= 0 ? <small className="text-danger">{state.errors.name}</small> : null}
          </div>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button type="button" className="btn btn-primary" onClick={saveExam}>save</Button>
      <Button type="button" className="btn btn-secondary" onClick={handleModal}>Cancel</Button>
    </Modal.Footer>
  </Modal>
)
export default ExamStatusModal