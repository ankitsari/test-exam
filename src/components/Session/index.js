import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './session.css'

const data = [
    {
        id: 1,
        firstName: 'Karthik Kaveriselvan',
        dateCreated: '01/01/2017',
        dateTimeTestStart: '4/18/2018 10:06:30 PM',
        dateTimeTestEnd: '4/18/2018 12:04:10 PM',
        totalTimeTaken: '2 hour 35 min',
        source: 'Other',
        notes: 'Applied through LinkedIn',
        status: 'Fail',
    },
    {
        id: 2,
        firstName: 'Mike Xu',
        dateCreated: '09/09/2013',
        dateTimeTestStart: '3/4/2012 5:38:53 AM',
        dateTimeTestEnd: '3/4/2012 7:18:03 AM',
        totalTimeTaken: '1 hour 35 min',
        source: 'Other',
        notes: 'Did not discuss comp',
        status: 'Hired',
    },
    {
        id: 3,
        firstName: 'Roman Gekhman',
        dateCreated: '05/05/2015',
        dateTimeTestStart: '4/13/2018 10:42:20 PM',
        dateTimeTestEnd: '4/13/2018 11:55:50 PM',
        totalTimeTaken: '3 hour 30 min',
        source: 'LinkedIn',
        notes: 'no sponsorship Required',
        status: 'Fail',
    },
    {
        id: 4,
        firstName: 'Siva Kumar',
        dateCreated: '06/06/2016',
        dateTimeTestStart: '3/20/2018 7:15:08 PM',
        dateTimeTestEnd: '3/20/2018 11:51:01 PM',
        totalTimeTaken: '3 hour 01 min',
        source: 'Referral',
        notes: 'Proactive Outreach no',
        status: 'Pending',
    },
    {
        id: 5,
        firstName: 'Venkata Lingisetty',
        dateCreated: '04/04/2014',
        dateTimeTestStart: '3/4/2012 5:38:53 AM',
        dateTimeTestEnd: '3/4/2012 6:18:53 AM',
        totalTimeTaken: '1 hour 15 min',
        source: 'LinkedIn',
        notes: 'Upwork Test',
        status: 'Pending',
    },
];

class Session extends Component {
    constructor(props) {
        super(props);

        const isHideFail = false;
        const isHideHired = false;
        const filterList = data.filter(p => {
            if (!isHideFail && !isHideHired) {
                return p.status === 'Fail' || p.status === 'Hired';
            } else if(isHideFail && !isHideHired){
                return p.status !== 'Fail' || p.status === 'Hired'
            } else if(!isHideFail && isHideHired){
                return p.status === 'Fail' || p.status !== 'Hired'
            } else {
                return p.status !== 'Fail' || p.status !== 'Hired'
            }
        })
        this.state = {
            sessionList: data,
            filterList: filterList,
            where: {
                source: '',
                hideFail: isHideFail,
                hideHired: isHideHired,
            }
        }
    }

    onFilterChange = (e) => {
        const {sessionList, where} = this.state;
        const name = e.target.name;
        const value = e.target.value;
        const checked = e.target.checked;
        let filterList = sessionList.filter(p => {
            const fromSource = name === 'source'? value : where.source;
            return !fromSource ? true : p.source === fromSource;
        });
        const isHideFail = name === 'hideFail' ? checked : where.hideFail;
        const isHideHired = name === 'hideHired' ? checked : where.hideHired;
        filterList = filterList.filter(p => {
            if (!isHideFail && !isHideHired) {
                return p.status === 'Fail' || p.status === 'Hired';
            } else if(isHideFail && !isHideHired){
                return p.status === 'Hired';
            } else if(!isHideFail && isHideHired){
                return p.status === 'Fail';
            } else {
                return p.status !== 'Fail' && p.status !== 'Hired'
            }

        });
        this.setState({
            filterList: filterList,
            where: {
                ...where,
                [name]: name === 'source'? value : checked
            }
        })

    };
    render() {
        const {filterList, where} = this.state;
        return (
            <div className="administration">
                <div className="flex-row mt-3">
                    <h2>Administration</h2>
                </div>
                <div className="d-flex justify-content-end">
                    <form className="form-inline">
                        <label htmlFor="inlineFormInputName2 ">Source:</label>
                        <select className="form-control mb-2 ml-2 mr-sm-2 select-filter pointer select"
                                onChange={this.onFilterChange}
                                value={where.source}
                                name="source">
                            <option value="">--Select--</option>
                            <option value="Upwork">Upwork</option>
                            <option value="Referral">Referral</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="form-check mb-2 mr-sm-2">
                            <input type="checkbox"
                                   name="hideFail"
                                   checked={where.hideFail}
                                   onChange={this.onFilterChange}
                                   className="form-check-input pointer" />
                            <label className="form-check-label">
                                Hide Fail
                            </label>
                        </div>
                        <div className="form-check mb-2 mr-sm-2">
                            <input type="checkbox"
                                   name="hideHired"
                                   checked={where.hideHired}
                                   onChange={this.onFilterChange}
                                   className="form-check-input pointer" />
                            <label className="form-check-label">
                                Hide Hired
                            </label>
                        </div>
                        <Link to={'/session/create'} className="btn btn-blue mb-2" >Create new Test Session</Link>
                    </form>
                </div>
                <div className="clear"/>
                <div className="flex-row mt-3">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Test Start</th>
                            <th>Test End</th>
                            <th>Time Taken</th>
                            <th>Source</th>
                            <th>Notes</th>
                            <th><b>Status</b></th>
                            <th><b>Action</b></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            filterList && filterList.length > 0 && filterList.map((exam, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{exam.firstName}</td>
                                        <td>{exam.dateCreated}</td>
                                        <td>{exam.dateTimeTestStart}</td>
                                        <td>{exam.dateTimeTestEnd}</td>
                                        <td>{exam.totalTimeTaken}</td>
                                        <td>{exam.source}</td>
                                        <td className="notes">{exam.notes}</td>
                                        <td>
                                            <select className="form-control"
                                                    value={exam.status}
                                                    onChange={() => console.log('')}
                                                    name="status">
                                                <option value="Pending">Pending</option>
                                                <option value="Request Onsite">Request Onsite</option>
                                                <option value="Hired">Hired</option>
                                                <option value="Fail">Fail</option>
                                                <option value="Remove from Active">Remove from Active</option>
                                            </select>
                                        </td>
                                        <td>
                                            <Link to={`/session/view/${exam.id}`} className="btn btn-blue mr-1">View</Link>
                                            <a className="btn btn-blue mr-1">Delete</a>
                                            <Link to={`/session/edit/${exam.id}`} className="btn btn-blue">Edit</Link>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                        {
                            filterList && filterList.length === 0 &&
                            <tr>
                                <td colSpan={9} className="text-center">
                                    No Records Found!
                                </td>
                            </tr>
                        }
                        </tbody>
                    </table>

                </div>

            </div>
        );
    }
}

export default Session;
