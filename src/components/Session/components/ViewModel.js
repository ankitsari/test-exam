import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Loader from '../../Common/Loader'
import SourceInput from '../../Common/SourceInput'
import {getTestById, updateStatusMultiple} from "../../../utils/_data";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import '../session.css'
import { urlDomain, apiUrl } from "../../../utils/common"
import {notification} from 'antd'

class ViewModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            test: {},
            examStatusList:[],
            examStatus:''
        }
    }

    notifySuccess = () => {
        notification.success({
            message: `Update status success : ${this.state.test.examStatus}`,
            placement: 'topRight',
        })
    };

    notifyError = (err) => {
        notification.error({
            message: err.response && (err.response.data  || err.response.statusText) || 'please try again',
            placement: 'topRight',
        })
    };

    componentWillMount() {
        const testId = this.props.exam_id;
        if (testId) {
            getTestById(testId).then((res) => {
                this.setState({
                    testId: testId,
                    test: res || {},
                    loading: false,
                })
            }).catch((err) => {
                this.setState({
                    testId: testId,
                    loading: false,
                    statusChangeError:err.response.data,
                    test: {}
                });
                this.notifyError(err);
            })
        }
    }

    print = () => {
        const {test} = this.state;
        let mywindow = window.open('', 'PRINT', 'height=800,width=1300');
        mywindow.document.write('<html style="border-style: solid"><head><title>' + "View Session" + '</title>');
        mywindow.document.write('</head><body>');
        mywindow.document.write('<h1 style="color: #6b242f;">' + "View Session" + '</h1>');
        mywindow.document.write('<hr/>');
        mywindow.document.write('<p>' + "Name:" + "&emsp;" + test.name + '</p>');
        mywindow.document.write('<p>' + "Time Taken:" + "&emsp;" + test.timetaken + '</p>');
        mywindow.document.write('<p>' + "Source:" + "&emsp;" + test.source + '</p>');
        mywindow.document.write('<p>' + "Notes:" + "&emsp;" + test.notes + '</p>');

        test && test.questionAndAnswerList.length && test.questionAndAnswerList.map((que, i) => {
            let sir = i + 1;
            mywindow.document.write('<hr/>');
            mywindow.document.write('<p>' + "Question:" + "&nbsp;" + sir + '</p>')
            mywindow.document.write('<hr/>');
            mywindow.document.write('<p>' + que.question + '</p>');
            mywindow.document.write('<hr/>');
            mywindow.document.write('<p>' + "Answer:" + "&nbsp;" + sir + '</p>')
            mywindow.document.write('<hr/>');
            mywindow.document.write('<p>' + que.answer + '</p>')
        });

        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        mywindow.close();
        return true;
    };

    handleChange = (e) => {
        let {testId, test} = this.state;
        const data = {
            ids: [testId],
            StatusId: e.target.value,
        };
        const textName = e.target.selectedOptions[0].innerText;
        const statusId = e.target.value;
        updateStatusMultiple(data).then(res => {
            if (res && res.isSuccess) {
                this.props.updateSession({examStatus: statusId, id: testId});
                this.setState({
                    test: {
                        ...test,
                        examStatus: textName,
                    },
                    Status: null,
                    // successMsg:"success update",
                    statusChangeError: ''
                });
                this.notifySuccess(res);
            }
        }).catch(err => {
            // const resData = err.response && err.response.statusText;
            this.setState({
                successMsg:"",
                // statusChangeError: resData,
                Status:null
            });
            this.notifyError(err);
        });
    };

    render() {
        const {isOpen, onHandle} = this.props;
        const {test, loading, statusChangeError, Status} = this.state;
        let uniqueTestId = `${urlDomain}/ValidateToken/${test.uniqueTestId}`
        return (
            <Modal show={isOpen} onHide={onHandle} bsSize={"lg"} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                        View Session
                </Modal.Header>
                <Modal.Body>
                    {/*{statusChangeError && <div data-life="2" className="alert alert-danger">*/}
                        {/*<strong>Danger!</strong>  {statusChangeError}.*/}
                    {/*</div>}*/}
                    {/*{successMsg &&*/}
                        {/*<div className="alert alert-success">*/}
                            {/*<strong>Success!</strong> {successMsg}.*/}
                        {/*</div>*/}
                    {/*}*/}
                    {
                        !loading ? <div className="container admin-view">
                            <div className="row">
                                <div className='col-md-8'>
                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Name:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.name}
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Date Created:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.dateCreated}
                                        </div>
                                    </div>

                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Test Start:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.testStart}
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Test End:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.testEnd}
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Time Taken:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.timetaken}
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Status:</label>
                                        </div>
                                        <div className='col-sm-9'>

                                            {
                                                !statusChangeError && (!Status &&
                                                <div>
                                                    <span>{test.examStatus}</span>
                                                    <div className="btn-group btn-group-xs">
                                                        <button className="btn btn-blue"
                                                                onClick={() => this.setState({Status: true, successMsg: '', statusChangeError: ''})}
                                                                style={{marginLeft: 30}}>Change Status
                                                        </button>
                                                    </div>
                                                </div>)
                                            }

                                            {
                                                Status &&
                                                    <SourceInput className="form-control input-sm"
                                                                 value={(test.examStatus && parseInt(test.examStatus, 10)) || 0}
                                                                 onChange={this.handleChange}
                                                                 sources={this.props.examStatusList}
                                                                 name="examStatus"
                                                    />
                                            }

                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Source:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.source}
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Test Title:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.testTitleName}
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Test Link:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {
                                                test.uniqueTestId ?
                                                    <div>
                                                        <input type="text" id="txtUrl" className="form-control"
                                                               value={uniqueTestId}
                                                               style={{
                                                                   border: '1px dashed #999',
                                                                   borderRadius: 0,
                                                                   display: 'inline-block',
                                                                   maxWidth: '85%'
                                                               }}/>
                                                        <CopyToClipboard text={uniqueTestId}
                                                                         onCopy={() => this.setState({copied: true})}>
                                                            <input type="button" className="btn btn-primary"
                                                                   style={{borderRadius: 0, marginTop: -2}}
                                                                   value="Copy url"/>
                                                        </CopyToClipboard>
                                                        {this.state.copied ?
                                                            <span className="text-success">Copied.</span> : null}
                                                    </div>:
                                                null
                                            }
                                        </div>
                                    </div>
                                    <div className='row mb-3'>
                                        <div className='col-sm-3'>
                                            <label>Notes:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.notes}
                                        </div>
                                    </div>
                                    {test.linktozip && <div className='row'>
                                        <div className='col-sm-12'>
                                            <a href={`${apiUrl}/TestFiles/${test.linktozip}`} target="_blank">Link to Zip file</a>
                                        </div>
                                    </div>}
                                    {
                                        test.timetaken && <div className='row mb-3'>
                                            <div className='col-sm-3'>
                                                <label>Code:</label>
                                            </div>
                                            <div className='col-sm-9'>
                                                <button className="btn btn-blue" onClick={this.print}>print</button>
                                            </div>
                                        </div>
                                    }
                                    {
                                        test && test.questionAndAnswerList && test.questionAndAnswerList.length ? test.questionAndAnswerList.map((answer, i) => (
                                            <div key={i} className='panel panel-default'>
                                                <div className='row mb-3 panel-heading ml-0 mr-0 pl-0'>
                                                    <div className='col-sm-3'>
                                                        <label id={"question"+i}>Question {i+1}:</label>
                                                    </div>
                                                    <div className='col-sm-9'  style={{overflowX: 'auto', maxHeight: '380px'}} dangerouslySetInnerHTML={{ __html: answer.question }} />
                                                </div>
                                                <div className='row mb-3 panel-body'>
                                                    <div className='col-sm-3'>
                                                        <label id={i+1}>Answer {i+1} :</label>
                                                    </div>
                                                    <div className='col-sm-9'  dangerouslySetInnerHTML={{ __html: answer.answer }} />
                                                </div>
                                            </div>
                                        )): null
                                    }
                                </div>
                            </div>
                        </div> : <Loader/>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="btn btn-secondary" onClick={onHandle} >Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default ViewModel;