import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import swal from 'sweetalert';
import { createSession, updateSession } from '../../../utils/_data';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import SourceInput from '../../Common/SourceInput'
import CKEditor from "react-ckeditor-component";

class AbstractForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        notes: '',
        source: '',
        testId: ''
      },
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        notes: '',
        source: '',
        testId: '',
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.formData && nextProps.formData.id) {
      this.setState({
        fields: {
          ...nextProps.formData,
          examStatus: nextProps.formData.examStatus && parseInt(nextProps.formData.examStatus, 10),
        },
        errors: {
          ...this.state.errors,
          examStatus: '',
        }
      })
    }
  }

  componentDidMount() {
    const props = this.props;
    if (props.formData && props.formData.id) {
      this.setState({
        fields: {
          ...props.formData,
          examStatus: props.formData.examStatus && parseInt(props.formData.examStatus, 10),
        },
        errors: {
          ...this.state.errors,
          examStatus: '',
        }
      })
    }
  }

  validate = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value) {
          return 'First name is Required';
        } else {
          return '';
        }
      case 'lastName':
        if (!value) {
          return 'Last name is Required';
       } else {
          return '';
        }
      case 'email':
       if (!value) {
        return 'Email is Required';
        } else if (!value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
          return 'Email is invalid';
        } else {
          return '';
        }
      case 'examStatus':
        if (!value) {
          return 'Exam Status is Required';
        } else {
          return '';
        }
      case 'source':
        if (!value) {
          return 'Source Field is Required';
        } else {
          return '';
        }
      case 'testId':
        if (!value) {
          return 'Test Field is Required';
        } else {
          return '';
        }
        default: {
        return ''
      }
    }
 };

  handleChange = (e) =>{
    this.setState({
        errors: {
            ...this.state.errors,
            [e.target.name]: this.validate(e.target.name, e.target.value),
        },
        fields: {
            ...this.state.fields,
            [e.target.name]: e.target.value,
        }
    })
  };

  onQuestion = (e, queId) => {
    const { fields } = this.state;
    const answerItem = e.editor.getData();
    fields.questionsAnswerList && fields.questionsAnswerList.length && fields.questionsAnswerList.forEach((answer) => {
        if(answer.id === queId) {
          answer.answer = answerItem
        }
    })
    this.setState({
        answerItem
    })
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { fields } = this.state;
    let validationErrors = {};
    Object.keys(fields).forEach(name => {
      const error = this.validate(name, fields[name]);
      if (error && error.length > 0) {
        validationErrors[name] = error;
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      this.setState({errors: validationErrors});
      return;
    }
    if (this.props.testId) {
      updateSession(fields).then((res) => {
        swal("Record updated successfully", {
          icon: "success",
        }).then((msg) => {
          if(msg === 'Done') {
            this.props.history.push({
              pathname: '/'
            });
          }
        });
      }).catch((err) => {
        console.log(err)
      })
    } else {
      createSession(fields).then((res) => {
        swal("Record created successfully", {
          icon: "success",
        }).then(() => {
          this.setState({
            link: `http://${window.location.host}/${res}`
          })
        });
      }).catch((err) => {
        console.log(err)
      })
    }
  };

  render() {
    const {link, fields} = this.state;
    const {testId, examStatusList} = this.props;
    return (
      <div className="form-horizontal">
        {link ?
          <div className="row">
            <div className="mt-4 col-md-8 offset-md-2 col-sm-8 offset-sm-2 col-xs-12 token-header">
              <h2>Token Url</h2>
            </div>
            <div className="col-md-8 offset-md-2 col-sm-8 offset-sm-2 col-xs-12 text-center">
              <label className="text-left col-md-12 control-label mt-5"><b>Link to sent</b></label>
              <input type="text" id="txtUrl" className="form-control" value={link}
                     style={{border: '1px dashed #999', borderRadius: 0, display: 'inline-block', maxWidth: '85%'}}/>
              <CopyToClipboard text={link} onCopy={() => this.setState({copied: true})}>
                <input type="button" className="btn btn-primary" style={{borderRadius: 0, marginTop: -2}}
                       value="Copy url"/>
              </CopyToClipboard>
              {this.state.copied ? <span className="text-success">Copied.</span> : null}
            </div>
          </div>
          :
          <div>
            <div className="header mt-4">
              <h2>{this.props.label}</h2>
            </div>
            <hr/>
            <div className="form col-sm-10 offset-sm-1 col-md-10 offset-md-1 col-xs-12">

              <div className="form-group row">
                <label className="col-sm-4 col-form-label">First Name</label>
                <div className="col-sm-8">
                  <input type="text"
                         name="firstName"
                         className="form-control"
                         value={this.state.fields.firstName || ''}
                         onChange={this.handleChange}/>
                  <small className="error">{this.state.errors.firstName}</small>
                </div>
              </div>


              <div className="form-group row">
                <label className="col-sm-4 col-form-label ">Last Name</label>
                <div className="col-sm-8">
                  <input type="text"
                         name="lastName"
                         className="form-control" value={this.state.fields.lastName}
                         onChange={this.handleChange}/>
                  <small className="error">{this.state.errors.lastName}</small>
                </div>
              </div>

              {!testId &&
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Email</label>
                <div className="col-sm-8">
                  <input type="text"
                         name="email"
                         className="form-control" value={this.state.fields.email}
                         onChange={this.handleChange}/>
                  <small className="error">{this.state.errors.email}</small>
                </div>
              </div>
              }
              {testId &&
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Status</label>
                <div className="col-sm-8">
                  <SourceInput className="form-control"
                               value={(this.state.fields.examStatus && parseInt(this.state.fields.examStatus, 10)) || 0}
                               onChange={this.handleChange}
                               sources={examStatusList}
                               name="examStatus"
                  />
                  <small className="error">{this.state.errors.examStatus}</small>
                </div>
              </div>
              }

              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Notes</label>
                <div className="col-sm-8">
                        <textarea className="form-control"
                                  name="notes"
                                  value={this.state.fields.notes || ''}
                                  onChange={this.handleChange}/>
                </div>
              </div>


              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Source</label>
                <div className="col-sm-8">
                  <SourceInput className="form-control"
                               name="source"
                               value={parseInt(this.state.fields.source, 10).toString()}
                               onChange={this.handleChange}
                               sources={this.props.sources}
                  />
                  <small className="error">{this.state.errors.source}</small>
                </div>
              </div>


              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Test</label>
                <div className="col-sm-8">
                  <select className="form-control"
                          name="testId"
                          value={this.state.fields.testId}
                          onChange={this.handleChange}>
                    <option value="">--Select--</option>
                    {
                      this.props.exams.length && this.props.exams.map((exam, i) => (
                        <option key={i} value={exam.testId}>{exam.testName}</option>
                      ))
                    }
                  </select>
                  <small className="error">{this.state.errors.testId}</small>
                </div>
              </div>
              {
                testId ? fields.questionsAnswerList && fields.questionsAnswerList.length > 0 && fields.questionsAnswerList.map((question, i) => {
                    return (
                      <div key={i} className="form-group row mt-5">
                        <label className="col-sm-12">Question {i + 1}</label>
                        <div className="col-sm-12" dangerouslySetInnerHTML={{__html: question.question}}/>
                        <label className="col-sm-12"> Answer {i + 1} </label>
                        <div className="col-sm-12">
                          <CKEditor
                              activeClass="p10"
                              data={question.id}
                              events={{
                                  "change": (e) => this.onQuestion(e, question.id)
                              }}
                              content={question.answer}/>
                        </div>
                      </div>
                    )
                  })
                  : null
              }
              <div className="row">
                <div className="col-sm-2 offset-sm-4">
                  <button className="form-control btn btn-success"
                          onClick={this.handleSubmit}>{this.props.label === 'Edit' ? 'Update' : 'Save'}</button>
                </div>
                <div className="col-sm-2">
                  <Link className="form-control btn btn-primary" to={'/'}>Cancel</Link>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default AbstractForm;