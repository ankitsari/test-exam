import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import {notification} from 'antd'
import {Link} from 'react-router-dom';
import Loader from '../../Common/Loader'
import {getTestById} from "../../../utils/_data";

class ViewModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            test: {}
        }
    }

    notifyError = (err) => {
        notification.error({
            message: err.message || 'Please try again.',
            placement: 'topRight',
        })
    };

    componentWillMount() {
        const testId = this.props.exam_id;
        if (testId) {
            getTestById(testId).then((res) => {
                this.setState({
                    test: res || {},
                    loading: false,
                })
            }).catch((err) => {
                this.notifyError(err);
                this.setState({
                    loading: false,
                    test: {}
                })
            })
        }
    }

    render() {
        const {isOpen, onHandle} = this.props;
        const {test, loading} = this.state;
        return (
            <Modal show={isOpen} onHide={onHandle} bsSize={"large"}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        View
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        !loading ? <div className="container admin-view">
                            <div className="row mt-2">
                                <div className=' col-md-8'>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Name:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            {test.name}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Created At:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            {test.dateCreated}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Test Start:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            {test.testStart}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Test End:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            {test.testEnd}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Time Taken:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            {test.timetaken}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Status:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            {test.examStatus}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Source:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            {test.source}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Test Title:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            {test.testTitleName}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Notes:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            {test.notes}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-12'>
                                            <Link to={'/'}>Link to Zip file</Link>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <label>Code:</label>
                                        </div>
                                        <div className='col-sm-8'>
                                            <button className="btn btn-blue" onClick={() => window.print()}>print</button>
                                        </div>
                                    </div>
                                    {
                                        test && test.questionAndAnswerList && test.questionAndAnswerList.length ? test.questionAndAnswerList.map((answer, i) => (
                                            <div key={i}>
                                                <div className='row'>
                                                    <div className='col-sm-12'>
                                                        <label>Question {i+1}:</label>
                                                    </div>
                                                    <div className='col-sm-12' dangerouslySetInnerHTML={{ __html: answer.question }} />
                                                </div>
                                                <div className='row'>
                                                    <div className='col-sm-12'>
                                                        <label>Answer {i+1} :</label>
                                                    </div>
                                                    <div className='col-sm-12' dangerouslySetInnerHTML={{ __html: answer.answer }} />
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