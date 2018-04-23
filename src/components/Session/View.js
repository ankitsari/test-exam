import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            dateCreated: '',
            dateTimeTestStart: '',
            dateTimeTestEnd: '',
            totalTimeTaken: '',
            source: '',
            status: '',
            notes: '',
            exams: [
                {
                    id:1,
                    firstName: 'jay',
                    dateCreated: '03/05/2018',
                    dateTimeTestStart: '3/6/2018 5:38:53 AM',
                    dateTimeTestEnd: '3/6/2018 8:14:29 AM',
                    totalTimeTaken: '2 hour 35 min',
                    source: '',
                    status: 'pending',
                    notes: 'P- 13 an hour',
                    testTitle: 'Postfix mathematical expression',
                },
            ]
        }
    }

    componentWillMount(){

    const {exams} = this.state;
        this.setState({
            ...exams[0]
        })
    }

    render() {
        return (
            <div className="container admin-view">
                <div className="row mt-2 col-md-8">
                    <h2>View</h2>
                </div>
                <div className="row col-md-8 mt-2">
                    <table className="table table-bordered table-hover">
                        <tbody>
                            <tr>
                                <td>Name:</td>
                                <td> {this.state.firstName}</td>
                            </tr>
                            <tr>
                                <td>Created At:</td>
                                <td>{this.state.dateCreated}</td>
                            </tr>
                            <tr>
                                <td>Test Start:</td>
                                <td>{this.state.dateTimeTestStart}</td>
                            </tr>
                            <tr>
                                <td>Test End:</td>
                                <td>{this.state.dateTimeTestEnd}</td>
                            </tr>
                            <tr>
                                <td>Time Taken:</td>
                                <td>{this.state.totalTimeTaken}</td>
                            </tr>
                            <tr>
                                <td>Status:</td>
                                <td>{this.state.status}</td>
                            </tr>
                            <tr>
                                <td>Source:</td>
                                <td>{this.state.source}</td>
                            </tr>
                            <tr>
                                <td>Test Title:</td>
                                <td>{this.state.testTitle}</td>
                            </tr>
                            <tr>
                                <td>Notes:</td>
                                <td>{this.state.notes}</td>
                            </tr>
                            <tr>
                                <td colSpan={2}><Link to={'/'}>Link to Zip file</Link></td>
                            </tr>
                            <tr>
                                <td>Code:</td>
                                <td><button className="btn btn-blue">print</button></td>
                            </tr>
                            <tr>
                                <td>Question #1 :</td>
                                <td> Explain in a few words what did you do to optimize the program</td>
                            </tr>
                            <tr>
                                <td>Answer #1 :</td>
                                <td>Used LINQ </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <Link className="btn-blue no-print" to={"/"}>Back to List</Link>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>
        );
    }
}

export default View;