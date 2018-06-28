import React, {Component} from 'react'
import swal from 'sweetalert'
import {connect} from 'react-redux'
import moment from 'moment'
import {Table, notification} from 'antd'

import {getSessionTestsList, getSourcesList, } from '../../Redux/actions/index'
import {
    getExamStatusList,
    filterListSession,
    deleteSession,
    updateStatusMultiple,
    multipleDelete,
    getTestsList,
    getSourceList,
    getExamsList
} from "../../utils/_data";
import SourceInput from '../Common/SourceInput'
import Loader from '../Common/Loader'
import './session.css'
import 'antd/dist/antd.css'
import SessionModal from "./components/SessionModal";
import ViewModel from "./components/ViewModel";

const mapStateToProps = state => ({
    testList: state.tests && state.tests.tests,
    sources: (state.tests && state.tests.sources) || [],
    errorMsg: state.tests && state.tests.error,
    sessionErr : state.tests.sessionError,
    examListError: state.tests.examListErrorMessage,
    sourcesListError: state.tests.sourcesListErrorMessage,
});

const mapDispatchToProps = dispatch => ({
    fetchTests: dispatch(getSessionTestsList),
    fetchSources: dispatch(getSourcesList),
});


class Session extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            sessionList: [],
            filterList: [],
            examStatusList: [],
            examList: [],
            sources: [],
            exams: [],
            sortList: false,
            where: {
                sourceId: '',
                hideFail: '',
                hideHired: '',
                hideRequestOnSite:''
            },
            selectedRowKeys: [],
            sortedInfo: {
                order: 'descend',
                columnKey: '',
            },
            examStatusError:'',
            isSessionModel:'',
            isSessionView:'',
            exam_id:'',
            filterSession:'',
            testData: null,
            selectedRows:[]
        }
    }

    async componentWillMount() {
           try {
            let [resSources, examStatusList, examList, filterSession] = await Promise.all([
                getSourceList(),
                getExamStatusList(),
                getExamsList(),
                filterListSession({"CheckDefault":0}),
            ]);

            const lstAdministration = filterSession && filterSession.lstAdministration || [];
            lstAdministration.forEach(p => {
                p.key = p.id;
            })
               if (!filterSession) {
                   filterSession = {};
               }
               filterSession = {
                   ...filterSession,
                   lstAdministration: lstAdministration,
               }
            this.setState({

                examStatusList: examStatusList || [],
                examList: examList && examList.data.map(p => ({id: p.testId ,name: p.testTitle})) || [],
                sources: resSources && resSources.data || [],
                loading: false,
                where: filterSession,
            })
        } catch (err) {
            this.notifyError(err);
            this.setState({
                loading: false,
            })
        }
    }

    afterInsertSuccess = async () =>{
        try {
            let res = await filterListSession({"CheckDefault":0});
            const lstAdministration = res && res.lstAdministration || [];
            lstAdministration.forEach(p => {
                p.key = p.id;
            })
            if (!res) {
                res = {};
            }
            res = {
                ...res,
                lstAdministration: lstAdministration,
            }
            this.setState({where: res});
        } catch (err) {
                this.notifyError(err)
        }
    }

    notifyError = (err) => {
        notification.error({
            message: err.message || 'Please try again.',
            placement: 'topRight',
        })
    };

    updateSession = (session) => {
       let {lstAdministration} = this.state.where
       const newSessionList = lstAdministration.length && lstAdministration.map(p => {
            if (p.id === session.id) {
                return {
                    ...p,
                    ...session,
                }
            }
            return p;
        }) || [];

        this.setState({
            where:{
                ...this.state.where,
                lstAdministration:newSessionList
            }
        })
    };

    onFilterChange = (e) => {
        const {where} = this.state;
        const value = e.target.value;
        const checked = e.target.checked;
        const data = {
            ...where,
            [e.target.name]: e.target.type === "checkbox" ? checked : value
        };
        delete data.listOrder;
        delete data.listSort;
        delete data.lstAdministration;
        filterListSession(data).then(res => {
            this.setState({
                where:res
            })
        }).catch(err => {
            this.notifyError(err);
        });
    };



    notifySuccess = () => {
        notification.success({
            message: `Update status success`,
            placement: 'topRight',
        })
    };

    onChange = (e) => {
        let {selectedRowKeys, examStatusList} = this.state;
        let {lstAdministration} = this.state.where;
        let source = examStatusList.filter(s => s.id === parseInt(e.target.value, 10));
        if (!source) {
            return;
        }
        const targetId = e.target.getAttribute('data-id');
        const sId = targetId && parseInt(targetId);
        const value = e.target.value;

        const ids = e.target.name === "ddlStatusForAll" ? selectedRowKeys : [sId && parseInt(sId)];
        let statusChange = {
            ids: ids,
            StatusId: value
        };
        const self = this;
        updateStatusMultiple(statusChange).then(res => {
            if (res && res.isSuccess) {
                lstAdministration.forEach(exam => {
                    if (ids.indexOf(exam.id) !== -1) {
                        exam.examStatus = value
                    }
                });
                self.setState({
                    where: {
                        ...self.state.where,
                        lstAdministration: lstAdministration,
                    },
                })
                this.notifySuccess();
            }
        }).catch(err => {
            this.setState({
                statusChangeError: err.message,
            })
            this.notifyError(err);
        });
    }

    onDelete = (sessionId) => {
        const {lstAdministration} = this.state.where;
        const self = this;
        if (sessionId) {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this session details!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((status) => {
                if (status) {
                    deleteSession(sessionId).then((res) => {
                        if (res && res.isSuccess) {
                            let sessionListIndex = lstAdministration.findIndex(x => x.id === sessionId);
                            lstAdministration.splice(sessionListIndex, 1);
                            this.setState({
                                where: {
                                    ...self.state.where,
                                    lstAdministration
                                },
                            });
                            swal({
                                title: 'Your session details has been deleted!',
                                icon: "success",
                            });
                        } else {
                            swal({
                                title: 'Please, try a later ',
                                icon: "warning",
                            });
                        }
                    }).catch((err) => {
                        this.notifyError(err);
                    })
                }
            });
        }
    };

    onMultipleDelete = () => {
        let {selectedRowKeys} = this.state;
        const {lstAdministration} = this.state.where
        if (selectedRowKeys && selectedRowKeys.length) {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this session details!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((status) => {
                if (status) {
                    multipleDelete(selectedRowKeys).then((res) => {
                        if (res && res.isSuccess) {
                            let sList = lstAdministration.filter(x => !selectedRowKeys.includes(x.id));
                            this.setState({
                                selectedRowKeys: [],
                                where: {
                                    ...this.state.where,
                                    lstAdministration: sList,
                                }
                            });
                            swal({
                                title: 'Your session details has been deleted!',
                                icon: "success",
                            });
                        } else {
                            swal({
                                title: 'Please, try a later ',
                                icon: "warning",
                            });
                        }
                        selectedRowKeys = [];
                        this.setState({
                            selectedRowKeys
                        })
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            });
        }
    }

    onChangeCheck = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys: selectedRowKeys,
        })
    };

    getCheckboxProps = record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    });

    handleSortChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    handleSessionModal = (test) => {
        if(test){
            this.setState({
                isSessionModel: !this.state.isSessionModel,
                testData: test
            })
        }else {
            this.setState({
                isSessionModel: !this.state.isSessionModel,
                testData: null
            })
        }
    };

    handleSessionView = (id) => {
        this.setState({
            isSessionView: !this.state.isSessionView,
            exam_id:id
        })
    };

    render() {
        const {where, examStatusList, selectedRowKeys, isSessionModel} = this.state;
        const {examListError, sourcesListError} = this.props;
        let {sortedInfo, examStatusError, exam_id, isSessionView} = this.state;
        const rowSelection = {
            onChange: this.onChangeCheck,
            getCheckboxProps: this.getCheckboxProps
        };
        sortedInfo = sortedInfo || {};
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            },
            {
                title: 'Created At',
                dataIndex: 'dateCreated',
                style: {width: '15%'},
                render: text => (text && moment(text).format('MM/DD/YYYY')) || "",
                sorter: (a, b) => moment(a.dateCreated).unix() - moment(b.dateCreated).unix(),
                sortOrder: sortedInfo.columnKey === 'dateCreated' && sortedInfo.order,
            },
            {
                title: 'Test Start',
                dataIndex: 'testStart',
                style: {width: '15%'},
                key: 'timeStampTestStart',
                sorter: (a, b) => a.timeStampTestStart - b.timeStampTestStart,
                sortOrder: sortedInfo.columnKey === 'timeStampTestStart' && sortedInfo.order,
            },
            {
                title: 'Test End',
                dataIndex: 'testEnd',
                style: {width: '15%'},
                key: 'timeStampTestEnd',
                sorter: (a, b) => a.timeStampTestEnd - b.timeStampTestEnd,
                sortOrder: sortedInfo.columnKey === 'timeStampTestEnd' && sortedInfo.order,
            },
            {
                title: 'Time Taken',
                dataIndex: 'timetaken',
                style: {width: '15%'},
                key: 'timeStampTimeTaken',
                sorter: (a, b) => a.timeStampTimeTaken - b.timeStampTimeTaken,
                sortOrder: sortedInfo.columnKey === 'timeStampTimeTaken' && sortedInfo.order,
            },
            {
                title: 'Source',
                dataIndex: 'source',
                style: {width: '15%'},
                sorter: (a, b) => a.source.toLowerCase().localeCompare(b.source.toLowerCase()),
                sortOrder: sortedInfo.columnKey === 'source' && sortedInfo.order,
            },
            {
                title: 'Notes',
                dataIndex: 'notes',
                className: "notes",
                key: 'notes',
                sorter: (a, b) => a.notes && a.notes.toLowerCase().localeCompare((b.notes && b.notes.toLowerCase()) || ""),
                sortOrder: sortedInfo.columnKey === 'notes' && sortedInfo.order,
            },
            {
                title: 'Status',
                dataIndex: 'examStatus',
                key: 'examStatus',
                render: (examStatus, exam) => <SourceInput className="form-control select-input"
                                                           value={parseInt(examStatus, 10)}
                                                           onChange={(e) => this.onChange(e, examStatus)}
                                                           sources={examStatusList}
                                                           name="status"
                                                           data={exam.id}/>,
                sorter: (a, b) => a.examStatus - b.examStatus,
                sortOrder: sortedInfo.columnKey === 'examStatus' && sortedInfo.order,
            },
            {
                title: 'Action',
                dataIndex: '',
                width: '15%',
                render: (text, exam) =>
                    <div className="form-inline">
                        <span className="btn btn-blue mr-1"
                              onClick={() => this.handleSessionView(exam.id)}>View</span>

                        {/*<Link to={{pathname: `/session/edit/${exam.id}`, state: {testId: exam.id}}}*/}
                              {/*className="btn btn-blue btn-sm mr-1">Edit</Link>*/}
                        <span onClick={() => this.handleSessionModal(exam)}
                              className="btn btn-blue btn-sm mr-1">Edit</span>
                        <button className="btn btn-danger btn-sm" onClick={() => this.onDelete(exam.id)}>Delete
                        </button>
                    </div>
            },
        ];

        if (this.state.loading) {
            return  <Loader/>
        }
        let finalError = []
        if(examListError) {
            finalError.push(examListError)
        }
        if(examStatusError) {
            finalError.push(examStatusError)
        }
        if(sourcesListError) {
            finalError.push(sourcesListError)
        }
        return (

            <div className="administration">
                <div className="flex-row mt-3">
                    <h2>Administration</h2>
                </div>
                <hr/>
                {finalError &&  finalError.length > 0 &&
                <div className="alert alert-danger">
                    {
                        finalError.map(p => (<span><span>{p}</span><br/></span> ))
                    }
                </div>}
                <div className="d-flex justify-content-end">
                    <div className="panel panel-default">
                        <div className="panel-heading"><b>configure</b>
                            <span style={{float: 'right'}} onClick={() => this.handleSessionModal(null)} className="btn btn-blue mb-2">Create new Test Session</span>
                            {/*<Link to={'/session/create/250'} style={{float: 'right'}} className="btn btn-blue mb-2">Create new Test Session</Link>*/}
                        </div>
                        <div className="panel-body">
                            <form className="form-inline">
                                {selectedRowKeys.length > 0 ?
                                    <div>
                                        <a className="btn btn-blue mb-2" onClick={this.onMultipleDelete}>Delete Selected</a>
                                        <select className="form-control mb-2 ml-2 mr-sm-2 select-filter pointer select"
                                                name="ddlStatusForAll" onChange={this.onChange}>
                                            <option value="">Update Status for all Selected</option>
                                            {
                                                examStatusList && examStatusList.length && examStatusList.map((source) => (
                                                    <option key={source.id} value={source.id.toString()}>{source.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    : null
                                }

                                <label htmlFor="inlineFormInputName2">Source:</label>
                                <div className="form-group">
                                    <SourceInput className="form-control mb-2 ml-2 mr-sm-2 select-filter pointer select"
                                                 onChange={this.onFilterChange}
                                                 value={where.SourceId}
                                                 sources={this.state.sources}
                                                 name="SourceId"
                                    />
                                </div>

                                <div className="form-check mb-2 mr-sm-2">
                                    <input type="checkbox"
                                           name="hideFailed"
                                           checked={where.hideFailed}
                                           onChange={this.onFilterChange}
                                           className="form-check-input pointer"/>
                                    <label className="form-check-label">
                                        Hide Fail
                                    </label>
                                </div>

                                <div className="form-check mb-2 mr-sm-2">
                                    <input type="checkbox"
                                           name="hideHired"
                                           checked={where.hideHired}
                                           onChange={this.onFilterChange}
                                           className="form-check-input pointer"/>
                                    <label className="form-check-label">
                                        Hide Hired
                                    </label>
                                </div>

                                <div className="form-check mb-2 mr-sm-2">
                                    <input type="checkbox"
                                           name="hideRequestOnSite"
                                           checked={where.hideRequestOnSite}
                                           onChange={this.onFilterChange}
                                           className="form-check-input pointer"/>
                                    <label className="form-check-label">
                                        Request On Site
                                    </label>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
                <div className="clear"/>
                {/*<span style={{color: "red"}}>{this.props.errorMsg.sessionTestsError}</span>*/}
                <Table rowSelection={rowSelection} columns={columns} dataSource={where.lstAdministration}
                       onChange={this.handleSortChange}/>

                {isSessionModel && <SessionModal isOpen={isSessionModel}
                              onHandle={this.handleSessionModal}
                              updateSession={this.updateSession}
                              afterInsertSuccess={this.afterInsertSuccess}
                              examStatusList={examStatusList}
                              sources={this.state.sources}
                              testData={this.state.testData}
                              examList={this.state.examList}
                />}
                {isSessionView && <ViewModel isOpen={isSessionView}
                           onHandle={this.handleSessionView}
                           updateSession={this.updateSession}
                           exam_id={exam_id}
                           examStatusList={examStatusList}
                />}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Session);

