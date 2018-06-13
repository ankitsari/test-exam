import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import swal from 'sweetalert'
import {connect} from 'react-redux'
import moment from 'moment'
import { Table } from 'antd'
import {getSessionTestsList, getSourcesList} from '../../Redux/actions/index'
import {getExamStatusList, deleteSession, deleteExamsById} from "../../utils/_data";
import SourceInput from '../Common/SourceInput'
import Loader from '../Common/Loader'
import './session.css'
import 'antd/dist/antd.css'

const mapStateToProps = state => ({
  testList: state.tests && state.tests.tests,
  sources: (state.tests && state.tests.sources) || [],
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
      exams: [],
      sortList: false,
      where: {
        sourceId: '',
        hideFail: false,
        hideHired: false,
      },
      selectedRowKeys: [],
      sortedInfo: {
        order: 'descend',
        columnKey: '',
      },
    }
  }

  componentWillMount() {
    this.props.fetchTests();
    this.props.fetchSources();
    this.getExamStatus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.testList && nextProps.testList.length && this.state.examStatusList && this.state.examStatusList.length) {
      const testList = nextProps.testList;
      testList.forEach(test => {
        test.timeStampTestStart = test.testStart ? moment(test.testStart).unix() : 0;
        test.timeStampTestEnd = test.testEnd ? moment(test.testEnd).unix() : 0;
        test.timeStampTimeTaken = test.timeStampTestEnd - test.timeStampTestStart;
        test.key = test.id;
      })
      this.setState({
        filterList: testList,
        sessionList: testList,
      }, () => {
        this.sessionFilter(null, null, false)
      })
    }
  }

  getExamStatus = () => {
    getExamStatusList().then(res => {
      this.setState({
        examStatusList: res || [],
      })
    }).catch(err => {
    })
  }

  onFilterChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const checked = e.target.checked;
    this.sessionFilter(name, value, checked);
  };

  sessionFilter = (name, value, checked) => {
    const {sessionList, where} = this.state;
    let filterList = sessionList.filter(p => {
      const fromSource = name === 'sourceId' ? value : where.sourceId;
      return !fromSource ? true : p.sourceId === parseInt(fromSource, 10);
    });
    const isHideFail = name === 'hideFail' ? checked : where.hideFail;
    const isHideHired = name === 'hideHired' ? checked : where.hideHired;
    let failId = this.state.examStatusList.filter(s => s.name === 'Fail');
    failId = failId.length && failId[0].id;
    let hiredId = this.state.examStatusList.filter(s => s.name === 'Hired');
    hiredId = hiredId.length && hiredId[0].id;
    filterList = filterList.filter(p => {
      if (!isHideFail && !isHideHired) {
        return (parseInt(p.examStatus, 10) === failId) || (parseInt(p.examStatus, 10) === hiredId);
      } else if (isHideFail && !isHideHired) {
        return (parseInt(p.examStatus, 10) === hiredId);
      } else if (!isHideFail && isHideHired) {
        return parseInt(p.examStatus, 10) === failId;
      } else {
        return (parseInt(p.examStatus, 10) !== failId) && (parseInt(p.examStatus, 10) !== hiredId)
      }
    });
    if (name) {
      this.setState({
        filterList: filterList,
        where: {
          ...where,
          [name]: name === 'sourceId' ? value : checked,
        },
        loading: false,
      })
    } else {
      this.setState({
        loading: false,
        filterList: filterList,
      })
    }
  }
  sort = (field) => {
    const {filterList, sortList} = this.state;
    if(field === 'timeStampTestStart' || field === 'timeStampTestEnd' || field === 'timeStampTimeTaken') {
      if(sortList === field ) {
        filterList.sort((a, b) => {
          return b[field] - a[field];
        })
      }else {
        filterList.sort((a, b) => {
          return a[field] - b[field];
        })
      };
    }else if (sortList === field) {
      filterList.sort(function (a, b) {
        const nameA = a[field] && a[field].toString().toUpperCase();
        const nameB = b[field] && b[field].toString().toUpperCase();
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        return 0;
      });
    } else {
      filterList.sort(function (a, b) {
        const nameA = a[field] && a[field].toUpperCase();
        const nameB = b[field] && b[field].toUpperCase();
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      });
    }
    this.setState({
      filterList,
      sortList: sortList === field ? '' : field,
    });
  };

  onChange = (e) => {
    const {filterList} = this.state;
    let {selectedRowKeys} = this.state;
    let source = this.state.examStatusList.filter(s => s.id === parseInt(e.target.value, 10));
    if(e.target.name === "ddlStatusForAll") {
      filterList.forEach(exam => {
        if(selectedRowKeys.indexOf(exam.id) !== -1) {
          exam.examStatus = e.target.value
        }
      })
      this.setState({filterList})
    }
    if (source && source.length) {
      // let data = {
      //   examStatus: source[0].id,
      //   examStatusResult: source[0].name,
      //   id: fields.id
      // };
      /* updateSession(data).then((res) => {

       }).catch((err) => {
         console.log(err)
       })*/
    }
  }

  onDelete = (sessionId) => {
    const { filterList, sessionList } = this.state;
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
            if(res && res.isSuccess) {
              let filterListIndex = filterList.findIndex(x => x.id === sessionId);
              let sessionListIndex = sessionList.findIndex(x => x.id === sessionId);
              filterList.splice(filterListIndex, 1);
              sessionList.splice(sessionListIndex, 1);
              this.setState({
                filterList,
                sessionList,
              });
              swal({
                title: 'Your session details has been deleted!',
                icon: "success",
              });
            }else {
              swal({
                title: 'Please, try a later ',
                icon: "warning",
              });
            }
          }).catch((err) => {
            console.log(err)
          })

        }
      });
    }
  }

  onChangeCheck = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys
    })
  }

  getCheckboxProps = record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  })

  handleSortChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  render() {
    const {filterList, where, examStatusList, selectedRowKeys} = this.state;
    let { sortedInfo } = this.state;
    const rowSelection = {
      onChange: this.onChangeCheck,
      getCheckboxProps: this.getCheckboxProps
    }
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
        render: examStatus =>  <SourceInput className="form-control select-input"
                                            value={parseInt(examStatus, 10)}
                                            onChange={(e) => this.onChange(e, examStatus)}
                                            sources={examStatusList}
                                            name="status"/>,
        sorter: (a, b) => a.examStatus - b.examStatus,
        sortOrder: sortedInfo.columnKey === 'examStatus' && sortedInfo.order,
      },
      {
        title: 'Action',
        dataIndex: '',
        width: '15%',
        render: (text, exam) =>
          <div className="form-inline">
            <Link to={{pathname: `/session/view/${exam.id}`, state: {testId: exam.id}}} className="btn btn-blue mr-1">View</Link>
            <button className="btn btn-danger btn-sm mr-1" onClick={() => this.onDelete(exam.id)}>Delete</button>
            <Link to={{pathname: `/session/edit/${exam.id}`, state: {testId: exam.id}}} className="btn btn-blue btn-sm">Edit</Link>
          </div>
      },
    ];

    const loading = (
      <Loader/>
    );

    if (this.state.loading) {
      return loading
    }
    return (
      <div className="administration">
        <div className="flex-row mt-3">
          <h2>Administration</h2>
        </div>
        <hr/>
        <div className="d-flex justify-content-end">
          <form className="form-inline">
            { selectedRowKeys.length > 0 ?
              <div>
                <a className="btn btn-blue mb-2">Delete Selected</a>
                <select className="form-control mb-2 ml-2 mr-sm-2 select-filter pointer select" name="ddlStatusForAll" onChange={this.onChange} style={{height: 30, fontSize: 13, marginLeft: 10}}>
                  <option value="">Update Status for all Selected</option>
                  <option value="1">Pending</option>
                  <option value="2">Request Onsite</option>
                  <option value="3">Hired</option>
                  <option value="4">Fail</option>
                  <option value="5">Remove from Active</option>
                  <option value="6">test2</option>
                </select>
              </div>
              : null
            }

            <label htmlFor="inlineFormInputName2 ">Source:</label>
            <SourceInput className="form-control mb-2 ml-2 mr-sm-2 select-filter pointer select"
                         onChange={this.onFilterChange}
                         value={where.sourceId}
                         sources={this.props.sources}
                         name="sourceId"
            />
            <div className="form-check mb-2 mr-sm-2">
              <input type="checkbox"
                     name="hideFail"
                     checked={where.hideFail}
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
            <Link to={'/session/create'} className="btn btn-blue mb-2">Create new Test Session</Link>
          </form>
        </div>
        <div className="clear"/>
        <Table rowSelection={rowSelection} columns={columns} dataSource={filterList} onChange={this.handleSortChange}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Session);

