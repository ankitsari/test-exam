import React, {Component} from 'react';
import swal from 'sweetalert';
import { getExamDetail, submitTechnicalTest } from "../../../utils/_data";
import Loader from '../../Common/Loader'
import {notification, Button} from 'antd'


class TechnicalTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
          btnLoading:false,
          Filebase64: '',
          FileName: '',
          test: [],
          exam: {},
          errors: {},
          loading: true,
          endExam:''
        }
    }

    componentWillMount() {
        const examDetailId = (this.props.history.location.state && this.props.history.location.state.examDetailId);
        if (examDetailId) {
            this.examDetails(examDetailId)
        } else {
            notification.error({
                message: 'Something is wrong. please contact to administrator.',
                placement: 'topRight',
            });
            this.setState({
                loading: false,
                warnMessage: 'Something is wrong. please contact to administrator.'
            })
        }
    }
    examDetails = (examDetailId) => {
        getExamDetail(examDetailId).then((res) => {
            if(res && res.id) {
                this.setState({
                  test: res,
                  exam: res,
                  examDetailId,
                  loading: false,
                })
            }
        }).catch((err) => {
            const message = err.response && (err.response.data || err.response.statusText) || 'Please try again.';
            this.setState({
                loading: false,
                errorMessage: message
            });
            notification.error({
                message: message,
                placement: 'topRight',
            })
        })
    }

    onChangeFile = (e) => {
        const _this = this;
        const file = e.target.files[0];
        if(file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                _this.setState({
                    Filebase64: reader.result.split(',')[1],
                    FileName: file.name
                })
            };
            reader.onerror = (error) => {
                console.log('Error: ', error);
            };
        }
    }

    validate = (name, value) => {
        switch (name) {
          case 'listQuestionAnswer':
            if (!value) {
              return 'Answer is Required';
            } else {
              return '';
            }
          case 'FileName':
            if (!value) {
              return 'File is Required';
            } else {
              return '';
            }
          default: {
            return ''
          }
        }
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    notifyError = (err) => {
        notification.error({
            message: err.message || 'Please try again.',
            placement: 'topRight',
        })
    };

    onSubmit = () => {
      const { test, FileName, Filebase64, examDetailId ,btnLoading} = this.state;
      const listQuestionAnswer = [];
      test && test.questions.length && test.questions.forEach(que => {
        let answer = {};
          if (this.state[que.id]) {
              answer = {
                  id: que.id,
                  name: this.state[que.id],
              }
          } else {
              answer = {
                  id: que.id,
                  name: '',
              }
          }
        listQuestionAnswer.push(answer);
      });

      const fields = {
        listQuestionAnswer,
      }
      if(test.isAttachment || test) {
        fields.FileName = FileName
      }
      let validationErrors = {};
      Object.keys(fields).forEach((name) => {
        if(name === "listQuestionAnswer"){
          const err = [];
          listQuestionAnswer.forEach((item,index) =>{
            const error = this.validate(name, item.name);
            if (error && error.length > 0) {
              let questionError = {
                [index]: error,
              };
              err.push(questionError);
              validationErrors[name] = err;
            }
          });
        }else {
          const error = this.validate(name, fields[name]);
          if (error && error.length > 0) {
            validationErrors[name] = error;
          }
        }
      });
      if (Object.keys(validationErrors).length > 0) {
        this.setState({ errors: validationErrors });
        return;
      }
      const practicalTest = {
        Id: examDetailId,
        Filebase64,
        FileName,
        Questions: listQuestionAnswer
      };
      const _this = this;
      this.setState({btnLoading: true})
      submitTechnicalTest(practicalTest).then((res) => {
        if(res) {
            this.setState({
                btnLoading: false
            });
            swal("Thank You", {
                icon: "success",
            }).then(() => {
                this.setState({
                    endExam:"Thank you"
                })
            });
        }
      }).catch((err) => {
          this.setState({
              btnLoading: false
          });
          const resError = err.response;
          const message = resError && (resError.data || resError.statusText);
          this.notifyError({message: message || 'something is wrong'});
      })
    };

    render() {
        const { test, errors, warnMessage, errorMessage, endExam } = this.state;
        const loading = (
          <Loader/>
        );

        if (this.state.loading) {
          return loading
        }
        return (
            <div>
            {
                endExam.length ? <div className="container technical-test">
                        <div className="text-left mt-3">
                            <h2>Thank you</h2>
                        </div>
                    </div>
                    :
                    <div className="container technical-test">
                        <div className="text-left mt-3">
                            <h2>Practical Test</h2>
                        </div>
                        <hr/>
                        {
                            !warnMessage && !errorMessage &&
                            <div className="test-content row mt-3">
                                <form className="col-md-12 form-horizontal">
                                    {test.questions && test.questions.length && test.questions.map((que, i) => (
                                        <div key={i} className="form-group">
                                <span>
                                    <label><b>Question {i + 1}:</b></label>
                                    <ul>
                                        <li id={que.id} dangerouslySetInnerHTML={{__html: que.name}}/>
                                    </ul>
                                </span>
                                            <label className="control-label mt-3"> <b>Copy and Paste your
                                                code:</b></label>
                                            <textarea className="form-control"
                                                      name={que.id}
                                                      value={this.state[que.id] || ''}
                                                      onChange={this.onChange}
                                                      cols="20"
                                                      rows="6"/>
                                            {
                                                errors && errors.listQuestionAnswer && errors.listQuestionAnswer.map(err => (
                                                    err[i] && <small key={i} className="text-danger"> {err[i]}</small>
                                                ))
                                            }
                                        </div>
                                    ))}
                                </form>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label><b>Upload a zip file of your solution:</b></label>
                                        <input type="file" style={{width: 'unset'}} className="form-control-file"
                                               name="file" id="File" onChange={this.onChangeFile}/>
                                        <small className="text-danger"> {errors.FileName}</small>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group actions text-right">
                                        <Button type="primary" loading={this.state.btnLoading} onClick={this.onSubmit}>
                                            Submit Test Response
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            warnMessage &&
                            <div className="mt-3 alert alert-warning">
                                <strong>{warnMessage}</strong>
                            </div>
                        }
                        {
                            errorMessage &&
                            <div className="mt-3 alert alert-danger">
                                <strong>Error! {errorMessage}</strong>
                            </div>
                        }
                    </div>
            }
            </div>
        );
    }
}

export default TechnicalTest