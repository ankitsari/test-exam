import React, {Component} from 'react';
import Modal from 'react-bootstrap4-modal';
import Loader from '../../Common/Loader'
import CKEditor from "react-ckeditor-component";

class ExamModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      description: true,
      questions: [{
        name: ''
      }],
    }
  };

  componentDidMount() {
    const nextProps = this.props;
    if (nextProps.state && (nextProps.state.questions)) {
      this.setState({
        questions: nextProps.state.questions,
      })
    }
  }

  render() {
    const {isChecked, onChange, handleModal, addQuestion, removeQuestion, onQuestion, saveExam} = this.props;
    const {isModal, questions, testTitle, isAttachmentRequired, errors} = this.props.state;

    return (
      <Modal visible={isModal}>
        <div className="modal-header">
          <h5 className="modal-title">Create/Update Exam</h5>
          <button type="button" className="close" onClick={handleModal}>&times;</button>
        </div>
        <div className="modal-body">
          {this.props.loading ?
            <Loader/>:
            <div className="form-horizontal">
              <div className="form-group row">
                <label className="col-md-3 col-form-label">Test Title</label>
                <div className="col-md-9">
                  <input type="text"
                         name="testTitle"
                         value={testTitle}
                         onChange={onChange}
                         className="form-control"/>
                  {testTitle.length <= 0 ? <small className="text-danger">{errors.testTitle}</small> : null}
                </div>
              </div>
              <div className="form-group row">
                <label className="col-md-3">Attachment Required</label>
                <div className="col-md-9">
                  <input type="checkbox"
                         name="isAttachmentRequired"
                         checked={isAttachmentRequired}
                         onChange={isChecked}/>
                </div>
              </div>

              {questions && questions.map((que, i) => {
                return (
                  <div className="form-group row" key={i}>
                    <label className="col-md-3 ">Question {i + 1}</label>
                    <div className="col-md-9">
                      <CKEditor
                        activeClass="p10"
                        content={que.name}
                        events={{
                          "change": (e) => onQuestion(e, i)
                        }}
                      />
                      {
                        que.name.length <= 0 ? errors && errors.questions && errors.questions.map(err => (
                          err[i] && <small className="text-danger" key={i}>Question {i + 1 + err[i]}</small>
                        )) : null
                      }
                    </div>
                  </div>
                )
              })}
              <div className="text-right">
                {questions && questions.length < 20 &&
                <button type="button" className="btn btn-primary" onClick={addQuestion}>Add Question</button>}&nbsp;
                {
                  questions.length > 0 ? <button type="button" className="btn btn-primary" onClick={removeQuestion}>Remove Question</button>:null
                }
              </div>
            </div>
          }
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={saveExam}>save</button>
          <button type="button" className="btn btn-secondary" onClick={handleModal}>Cancel</button>
        </div>
      </Modal>
    )
  }
}

export default ExamModal