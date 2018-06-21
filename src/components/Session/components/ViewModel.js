import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Loader from '../../Common/Loader'
import SourceInput from '../../Common/SourceInput'
import {getTestById, updateStatusMultiple} from "../../../utils/_data";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import '../session.css'
import { urlDomain, apiUrl } from "../../../utils/common"

class ViewModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            test: {},
            examStatusList:[],
            examStatus:''
        }
    }

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
                })
            })
        }
    }

    print = () => {
        const {test} = this.state;
        var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>' + "View Session" + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write('<h1>' + "View Session"  + '</h1>');
        mywindow.document.write('<h3>' + "Name" + test.name  + '</h3>');
        mywindow.document.write('<h3>' + "Time Taken" + test.timetaken  + '</h3>');
        mywindow.document.write('<h3>' + "Source" + test.timetaken  + '</h3>');
        mywindow.document.write(document.getElementById("print1").innerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close();
        mywindow.focus();

        mywindow.print();
        mywindow.close();
        return true;
    }

    handleChange = (e) => {
        let {testId, test} = this.state;
        const data = {
            ids: [testId],
            StatusId: e.target.value,
        };
        const textName = e.target.selectedOptions[0].innerText;
        updateStatusMultiple(data).then(res => {
            if (res && res.isSuccess) {
                this.setState({
                    test: {
                        ...test,
                        examStatus: textName,
                    },
                    Status: null,
                    successMsg:"success update",
                    statusChangeError: ''

                })
            }
        }).catch(err => {
            const resData = err.response && err.response.statusText;
            this.setState({
                successMsg:"",
                statusChangeError: resData,
                Status:null
            })
        });
    };

    render() {

        const {isOpen, onHandle} = this.props;
        const {test, loading, statusChangeError, Status ,successMsg} = this.state;
        let uniqueTestId = `${urlDomain}/ValidateToken/${test.uniqueTestId}`
        return (
            <Modal show={isOpen} onHide={onHandle} bsSize={"lg"} dialogClassName="custom-modal ">
                <Modal.Header closeButton>
                        View Session
                </Modal.Header>
                <Modal.Body id="print1">
                    {statusChangeError && <div data-life="2" className="alert alert-danger">
                        <strong>Danger!</strong>  {statusChangeError}.
                    </div>}
                    {successMsg &&
                        <div className="alert alert-success">
                            <strong>Success!</strong> {successMsg}.
                        </div>
                    }
                    {
                        !loading ? <div className="container admin-view">
                            <div className="row mt-2">
                                <div className=' col-md-8'>
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label>Name:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.name}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label>Date Created:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.dateCreated}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label>Test Start:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.testStart}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label>Test End:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.testEnd}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label>Time Taken:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.timetaken}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label>Status:</label>
                                        </div>
                                        <div className='col-sm-9'>

                                            {
                                                !Status &&
                                                <div>
                                                    <span>{test.examStatus}</span>
                                                    <div className="btn-group btn-group-xs">
                                                        <button className="btn btn-blue"
                                                                onClick={() => this.setState({Status: true, successMsg: '', statusChangeError: ''})}
                                                                style={{marginLeft: 30}}>Change Status
                                                        </button>
                                                    </div>
                                                </div>
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
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label>Source:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.source}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label>Test Title:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            {test.testTitleName}
                                        </div>
                                    </div>
                                    <div className='row'>
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
                                    <div className='row'>
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
                                    <div className='row'>
                                        <div className='col-sm-3'>
                                            <label>Code:</label>
                                        </div>
                                        <div className='col-sm-9'>
                                            <button className="btn btn-blue" onClick={this.print}>print</button>
                                        </div>
                                    </div>
                                    {
                                        test && test.questionAndAnswerList && test.questionAndAnswerList.length ? test.questionAndAnswerList.map((answer, i) => (
                                            <div key={i}>
                                                <div className='row'>
                                                    <div className='col-sm-3'>
                                                        <label>Question {i+1}:</label>
                                                    </div>
                                                    <div className='col-sm-9' style={{overflowX: 'auto', maxHeight: '380px'}} dangerouslySetInnerHTML={{ __html: answer.question }} />
                                                </div>
                                                <div className='row'>
                                                    <div className='col-sm-3'>
                                                        <label>Answer {i+1} :</label>
                                                    </div>
                                                    <div className='col-sm-9' dangerouslySetInnerHTML={{ __html: answer.answer }} />
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