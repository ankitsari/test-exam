import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ExamModal from './ExamModal'
import './index.css'

const data = [
    {
        id: 1,
        testTitle: 'Postfix mathematical expression',
        description: 'Problem – Part 1\n' +
        'Given a string representing a postfix mathematical expression, write an algorithm that will evaluate the expression. The postfix expression must support the following ....',
    },
    {
        id: 2,
        testTitle: 'Karthik Kaveriselvan',
        description: '01/01/2017',
    },
    {
        id: 3,
        testTitle: 'Karthik Kaveriselvan',
        description: '01/01/2017',
    },
    {
        id: 4,
        testTitle: 'Karthik Kaveriselvan',
        description: '01/01/2017',
    },
    {
        id: 5,
        testTitle: 'Karthik Kaveriselvan',
        description: '01/01/2017',
    },
];

class ManageExam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            examList: data,
            isShowModal: false
        }
    }
    onShowModal = () => {
        this.setState({
            isShowModal: true,
        })
    }

    render() {
        const {examList, isShowModal} = this.state;
        return (
            <div className="manage-exam">
                <div className="flex-row mt-3">
                    <h2>Manage Exam</h2>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-blue mb-2" onClick={this.onShowModal}>Create New Test</button>
                </div>
                <div className="flex-row mt-3">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Test Title</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            examList && examList.length > 0 && examList.map((exam, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{exam.testTitle}</td>
                                        <td className="description-width">{exam.description}</td>
                                        <td>
                                            <a className="btn btn-blue mr-1">Delete</a>
                                            <Link to={`/manage-exam/edit/${exam.id}`} className="btn btn-blue">Edit</Link>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                        {
                            examList && examList.length === 0 &&
                            <tr>
                                <td colSpan={3} className="text-center">
                                    No Records Found!
                                </td>
                            </tr>
                        }
                        </tbody>
                    </table>

                </div>
                {isShowModal && <ExamModal title={'Create'} show={true}/>}

            </div>
        );
    }
}

export default ManageExam;
