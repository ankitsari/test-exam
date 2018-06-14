import React from 'react';
//import Modal from 'react-bootstrap4-modal';
import { Modal, Button } from 'react-bootstrap';

const StatusModal = ({handleModal, onChange, state, saveStatus}) =>  (
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
            {state.name.length <= 0 ? <small className="text-danger">{state.error}</small> : null}
          </div>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button type="button" className="btn btn-primary" onClick={saveStatus}>save</Button>
      <Button type="button" className="btn btn-secondary" onClick={handleModal}>Cancel</Button>
    </Modal.Footer>
  </Modal>
)
export default StatusModal