import React, {Component} from 'react';
import swal from 'sweetalert';
import { getExamDetail, submitTechnicalTest } from "../../../utils/_data";
import Loader from '../../Common/Loader'
import {notification} from 'antd'


class TechnicalTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
          Filebase64: '',
          FileName: '',
          test: [],
          exam: {},
          errors: {},
          loading: true,
        }
    }

    componentWillMount() {
        debugger
        const examDetailId = (this.props.history.location.state && this.props.history.location.state.examDetailId);
        if(examDetailId) {
           this.examDetails(examDetailId)
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
            this.setState({
              loading: false,
            })
            notification.error({
                message: err.response.data || 'Please try again.',
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
      const { test, FileName, Filebase64, examDetailId } = this.state;
      const listQuestionAnswer = [];
      test && test.questions.length && test.questions.forEach(que => {
        let answer = {};
        if(this.state[que.id]) {
          answer = {
            id: que.id,
            name: this.state[que.id],
          }
        }else {
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
      submitTechnicalTest(practicalTest).then((res) => {
        if(res) {
            swal("Thank You", {
                icon: "success",
            }).then(() => {
              _this.props.history.push({
                pathname: '/'
              });
            });
        }
      }).catch((err) => {
          this.notifyError(err);
      })
    }

    render() {
        const { test, errors } = this.state;
        const loading = (
          <Loader/>
        );

        if (this.state.loading) {
          return loading
        }
        return (
            <div className="container technical-test">
                <div className="text-left mt-3">
                    <h2>Practical Test</h2>
                </div>
                <hr/>
                <div className="test-content row mt-3">
                    <form className="col-md-12 form-horizontal" >
                        {test.questions && test.questions.length && test.questions.map((que, i) => (
                            <div key={i} className="form-group">
                                <span>
                                    <label><b>Question {i+1}:</b></label>
                                    <ul>
                                        <li id={que.id} dangerouslySetInnerHTML={{ __html: que.name }} />
                                    </ul>
                                </span>
                                <label className="control-label mt-3"> <b>Copy and Paste your code:</b></label>
                                <textarea className="form-control"
                                          name={que.id}
                                          value={this.state[que.id] || ''}
                                          onChange={this.onChange}
                                          cols="20"
                                          rows="6" />
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
                            <input type="file" style={{width: 'unset'}} className="form-control-file" name="file" id="File" onChange={this.onChangeFile} />
                            <small className="text-danger"> {errors.FileName}</small>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group actions text-right">
                            <button className="btn btn-blue btn-sm" onClick={this.onSubmit}>Submit Test Response</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TechnicalTest