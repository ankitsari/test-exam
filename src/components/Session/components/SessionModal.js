import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {isObject} from 'lodash';
import SourceInput from '../../Common/SourceInput'
import swal from 'sweetalert';
import {notification} from 'antd'
import {connect} from 'react-redux';
import Loader from '../../Common/Loader'
import CKEditor from "react-ckeditor-component";
import {createSession, updateSession, getTestByIdForEdit} from "../../../utils/_data"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import '../session.css'

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({});

class SessionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            copied: false,
            fields: {
                firstName: '',
                lastName: '',
                email: '',
                notes: '',
                testId: '',
                source: ''
            },
            errors: {
                firstName: '',
                lastName: '',
                email: '',
                notes: '',
                testId: '',
                source: '',
            },
            test: {},
            exams: [],
            sourceList: [],
            examList: [],
            link: '',
            testId: ''
        }
    }

    async componentDidMount() {
        let sessionId = this.props.testData && this.props.testData.id;
        try{
            if(sessionId) {
                const [test] = await Promise.all([
                    getTestByIdForEdit(sessionId)
                ]);
                this.setState({
                    test: test || {},
                    sessionId: sessionId || null,
                    loading: false,
                    fields:{
                        Id: sessionId,
                        firstName:test.firstName,
                        lastName:test.lastName,
                        examStatus:test.examStatus,
                        source:test.source,
                        notes:test.notes,
                        questionsAnswerList:test.questionsAnswerList,
                        testId:test.testId,
                    }
                })
            } else {
                this.setState({
                    test: {},
                    sessionId: null,
                    loading: false,
                    fields:{
                        firstName: '',
                        lastName:'',
                        source:'',
                        notes:'',
                        email:'',
                        testId:''
                    }
                })
            }
        }catch(err) {
            this.notifyError(err);
            this.setState({
                loading: false,
            })
        }
    }

    notifyError = (err) => {
        notification.error({
            message: err.message || 'Please try again.',
            placement: 'topRight',
        })
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

    handleChange = (e) => {
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

    handleSubmit = (ev) => {
        ev.preventDefault();
        const self = this;
        const {fields} = this.state;
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
        if (this.state.sessionId) {

            updateSession(fields).then((res) => {
                swal("Record updated successfully", {
                    icon: "success",
                }).then((msg) => {
                    if (msg) {
                        self.props.onHandle();
                    }
                });
            }).catch((err) => {
                this.setState({
                    createError:err.message
                });
                // this.notifyError(err);
                if(!err){
                    self.props.onHandle();
                }
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
                const res = err.response && err.response.data;
                if (isObject(res)) {
                    Object.keys(res).forEach(p => {
                        // this.notifyError({message: res[p]});
                        this.setState({
                            createError:res[p]
                        })
                    })
                } else {
                    this.setState({
                        createError:err.message
                    })
                    // this.notifyError(err);
                }
                if(!err){
                    self.props.onHandle();
                }
            })
        }
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

    render() {
        const {link, fields, errors, loading, createError} = this.state;
        const {onHandle, isOpen ,testData} = this.props;
        return (
            <Modal show={isOpen} onHide={onHandle} bsSize={"large"}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {link ?  <p style={{color:'white'}}>Token Url</p> : <p style={{color:'white'}}> {!testData ? <p>Create Session</p> : <p>Update Session</p>}</p>}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    { !loading ?
                        link ?
                        <div className="row">
                            <div className="col-md-12 col-sm-8 col-xs-12 text-center">
                                <label className="text-left col-md-12 control-label mt-5"><b>Link to sent</b></label>
                                <input type="text" id="txtUrl" className="form-control" value={link}
                                       style={{
                                           border: '1px dashed #999',
                                           borderRadius: 0,
                                           display: 'inline-block',
                                           maxWidth: '85%'
                                       }}/>
                                <CopyToClipboard text={link} onCopy={() => this.setState({copied: true})}>
                                    <input type="button" className="btn btn-primary"
                                           style={{borderRadius: 0, marginTop: -2}}
                                           value="Copy url"/>
                                </CopyToClipboard>
                                {this.state.copied ? <span className="text-success">Copied.</span> : null}
                            </div>
                        </div> :
                            <div className="form-horizontal">
                                {createError && <div  data-spy="marquee" data-life="2" className="alert alert-danger">
                                    <strong>Danger!</strong> {createError}.
                                </div>}
                                <div className="form-group row">
                                    <label className="col-md-3 col-form-label">First Name</label>
                                    <div className="col-md-9">
                                        <input type="text"
                                               name="firstName"
                                               className="form-control"
                                               value={fields.firstName || ''}
                                               onChange={this.handleChange}/>
                                        <small className="error">{errors.firstName}</small>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-3 col-form-label">Last Name</label>
                                    <div className="col-md-9">
                                        <input type="text"
                                               name="lastName"
                                               className="form-control" value={fields.lastName}
                                               onChange={this.handleChange}/>
                                        <small className="error">{errors.lastName}</small>
                                    </div>
                                </div>

                                {!testData && <div className="form-group row">
                                    <label className="col-md-3 col-form-label">Email</label>
                                    <div className="col-md-9">
                                        <input type="text"
                                               name="email"
                                           className="form-control" value={this.state.fields.email}
                                               onChange={this.handleChange}/>
                                        <small className="error">{errors.email}</small>
                                    </div>
                                </div>}

                                {testData &&
                                <div className="form-group row">
                                    <label className="col-md-3 col-form-label">Status</label>
                                    <div className="col-sm-9">
                                        <SourceInput className="form-control"
                                                     value={(fields.examStatus && parseInt(fields.examStatus, 10)) || 0}
                                                     onChange={this.handleChange}
                                                     sources={this.props.examStatusList}
                                                     name="examStatus"
                                        />
                                        <small className="error">{errors.examStatus}</small>
                                    </div>
                                </div>
                                }

                                <div className="form-group row">
                                    <label className="col-md-3 col-form-label">Notes</label>
                                    <div className="col-md-9">
                                        <textarea className="form-control"
                                                  name="notes"
                                                  value={fields.notes || ''}
                                                  onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-md-3 col-form-label">Source</label>
                                    <div className="col-md-9">
                                        <SourceInput className="form-control"
                                                     name="source"
                                                     value={parseInt(fields.source, 10).toString()}
                                                     onChange={this.handleChange}
                                                     sources={this.props.sources}
                                        />
                                        <small className="error">{errors.source}</small>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-md-3 col-form-label">Test</label>
                                    <div className="col-md-9">
                                        <SourceInput className="form-control"
                                                     name="testId"
                                                     value={parseInt(fields.testId, 10).toString()}
                                                     onChange={this.handleChange}
                                                     sources={this.props.examList}
                                        />
                                        <small className="error">{errors.testId}</small>
                                    </div>
                                </div>
                                {
                                    testData ? fields.questionsAnswerList && fields.questionsAnswerList.length > 0 && fields.questionsAnswerList.map((question, i) => {
                                        return (
                                            <div key={i} className="form-group row mt-5">
                                                <label className="col-sm-3">Question {i + 1}</label>
                                                <div className="col-sm-9"
                                                     style={{overflowX: 'auto', maxHeight: '380px'}}
                                                     dangerouslySetInnerHTML={{__html: question.question}}/>
                                                <label className="col-sm-3"> Answer {i + 1} </label>
                                                <div className="col-sm-9">
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
                                    }) : null
                                }
                            </div>
                        :<Loader/>
                    }
                </Modal.Body>

                {!link ?
                <Modal.Footer>
                    <Button className="btn btn-success"
                            onClick={this.handleSubmit}>{testData ? 'Update' : 'Save'}</Button>
                    <Button type="button" className="btn btn-secondary" onClick={onHandle}>Cancel</Button>
                </Modal.Footer>:null}
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionModal);