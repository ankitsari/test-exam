import React from 'react';
import {Modal} from 'react-bootstrap';
import {isObject} from 'lodash';
import SourceInput from '../../Common/SourceInput'
import swal from 'sweetalert';
import {notification, Button} from 'antd'
import {connect} from 'react-redux';
import Loader from '../../Common/Loader'
import CKEditor from "react-ckeditor-component";
import {createSession, updateSession, getTestByIdForEdit} from "../../../utils/_data"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {urlDomain} from '../../../utils/common';
import '../session.css'

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({});

class SessionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnLoading: false,
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
                const currentSource = this.props.sources && this.props.sources.find(p => p.id == test.source)
                const sourceText = currentSource && currentSource.name;
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
                        listQuestionAnswer:test.questionsAnswerList,
                        testId:test.testId,
                        sourceText: sourceText && sourceText || '',
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
            const resError = err.response;
            const message = resError && (resError.data || resError.statusText) || 'please try again.';
            this.notifyError({message: message || 'please try again'});
            this.setState({
                loading: false,
            });
            this.props.onHandle();
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
                } else if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
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
                if (!value || value === "0") {
                    return 'Source Field is Required';
                } else {
                    return '';
                }

            case 'testId':
                if (!value || value === "0") {
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
        const fields = {
            ...this.state.fields,
            [e.target.name]: e.target.value,
        }
        if (e.target.name === 'source') {
            fields.sourceText = e.target.selectedOptions[0].innerText;
            debugger;
        }
        this.setState({
            errors: {
                ...this.state.errors,
                [e.target.name]: this.validate(e.target.name, e.target.value),
            },
            fields
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
        this.setState({btnLoading: true})
        if (this.state.sessionId) {
            if (fields && fields.listQuestionAnswer && fields.listQuestionAnswer.length) {
                fields.listQuestionAnswer.forEach(p => p.question && delete p.question);
            }
            updateSession(fields).then((res) => {
                this.setState({
                    btnLoading: false
                })
                swal("Record updated successfully", {
                    icon: "success",
                }).then((msg) => {
                    const newSession = {
                        ...fields,
                        id: fields.Id,
                        name: `${fields.firstName} ${fields.lastName}`,
                        source: fields.sourceText || '',
                    };
                    if (msg) {
                        this.props.updateSession(newSession);
                        self.props.onHandle();
                    }
                });
            }).catch((err) => {
                const mError = err.response;
                const message = mError && (mError.data || mError.statusText) || 'something is wrong'
                this.setState({
                    btnLoading: false,
                    createError: message,
                });
                this.notifyError({message});
            })
        } else {
            createSession(fields).then((res) => {
                this.setState({
                    btnLoading: false
                })
                swal("Record created successfully", {
                    icon: "success",
                }).then(() => {
                    if(self.props){
                        self.props.afterInsertSuccess()
                    }
                    this.setState({
                        btnLoading: false,
                        link: `${urlDomain}/${res}`
                    })
                });
            }).catch((err) => {
                const res = err.response && (err.response.data || err.response.statusText);
                if (isObject(res)) {
                    const fieldsError = []
                    Object.keys(res).forEach(p => {
                        fieldsError.push(res[p])
                    })
                    this.setState({
                        btnLoading: false,
                        createError: fieldsError[0]
                    })
                } else {
                    this.setState({
                        btnLoading: false,
                        createError: res
                    })
                    this.notifyError({message: res});
                }
            })
        }
    };

    onQuestion = (e, queId) => {
        const { fields } = this.state;
        const answerItem = e.editor.getData();
        fields.listQuestionAnswer && fields.listQuestionAnswer.length && fields.listQuestionAnswer.forEach((answer) => {
            if (answer.answerId === queId) {
                answer.answer = answerItem
            }
        })
        this.setState({
            fields
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
                                    <strong>Error!</strong> {createError}.
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
                                               className="form-control"
                                               value={fields.lastName}
                                               onChange={this.handleChange}/>
                                        <small className="error">{errors.lastName}</small>
                                    </div>
                                </div>

                                {!testData && <div className="form-group row">
                                    <label className="col-md-3 col-form-label">Email</label>
                                    <div className="col-md-9">
                                        <input type="text"
                                               name="email"
                                               className="form-control"
                                               value={this.state.fields.email}
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
                                    testData ? fields.listQuestionAnswer && fields.listQuestionAnswer.length > 0 && fields.listQuestionAnswer.map((question, i) => {
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
                                                            "change": (e) => this.onQuestion(e, question.answerId)
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
                    <Button type="primary" loading={this.state.btnLoading} onClick={this.handleSubmit}>
                        {testData ? 'Update' : 'Save'}
                    </Button>
                    <Button type="button" className="btn btn-secondary" onClick={onHandle}>Cancel</Button>
                </Modal.Footer>:null}
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionModal);