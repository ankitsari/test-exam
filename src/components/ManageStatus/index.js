import React, {Component} from 'react';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import { Table } from 'antd'
import {getManageExamsList} from '../../Redux/actions/index'
import {deleteExamsById, editExamById, createExams, updateExam, getExamStatusList} from "../../utils/_data";
import ExamStatusModal from './components/ExamStatusModal'
import Loader from '../Common/Loader'
import '../ManageExamination/index.css'
import 'antd/dist/antd.css'

const mapStateToProps = state => ({
  examsList: state.exams && state.exams.exams,
});

const mapDispatchToProps = dispatch => ({
  fetchExams: dispatch(getManageExamsList),
});

class ManageStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isModal: false,
      name: '',
      errors: {
        name: '',
      },
      examStatusList: [],
      sortedInfo: {
        order: 'descend',
        columnKey: '',
      },
      sortList: false,
    }
  }

  componentWillMount() {
    this.getExamStatus()
  }

  getExamStatus = () => {
    getExamStatusList().then(res => {
      const examStatusList = res ? res.map(x => {
        x.key = x.id
        return x
      }) : []
      this.setState({
        examStatusList,
        loading: false,
      })
    }).catch(err => {
    })
  }

  removeExam = (statusId) => {
    const {examsList} = this.state;
    if (statusId) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this exam details",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((status) => {
        if (status) {
          deleteExamsById(statusId).then(() => {
            let index = examsList.findIndex(x => x.statusId === statusId);
            examsList.splice(index, 1);
            this.setState({
              examsList
            });
            swal("Your exam details has been deleted!", {
              icon: "success",
            });
          }).catch((err) => {
            console.log(err)
          })

        }
      });
    }
  };

  handleModal = (status) => {
    if (status && status.id) {
      this.setState({
        loading: true
      }, () => {
        this.setState({
          name: status.name,
          statusId: status.id,
          isModal: !this.state.isModal,
          loading: false
        });
      })
    } else {
      this.setState({
        isModal: !this.state.isModal,
        statusId: '',
        name: '',
        errors:{}
      });
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  validate = (name, value) => {
    switch (name) {
      case 'testTitle':
        if (!value) {
          return 'TestTitle is Required';
        } else {
          return '';
        }
      default: {
        return ''
      }
    }
  };

  saveExam = () => {
    const {testId, testTitle, isAttachmentRequired, questions, examsList} = this.state;
    let fields = {
      testTitle,
      questions,
    };

    let validationErrors = {};
    Object.keys(fields).forEach((name) => {
      if (name === "questions") {
        const err = [];
          questions.forEach((item, index) => {
          const error = this.validate(name, item.name);
          if (error && error.length > 0) {
            let questionError = {
              [index]: error,
            };
            err.push(questionError);
            validationErrors[name] = err;
          }
        });
      } else {
        const error = this.validate(name, fields[name]);
        if (error && error.length > 0) {
          validationErrors[name] = error;
        }
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      this.setState({errors: validationErrors});
      return;
    }

    let data = {
        testTitle,
        isAttachmentRequired,
        questions,
    };

    if (testId) {
      data.testId = testId;
      updateExam(data).then(() => {
        let index = examsList.findIndex(x => x.testId === testId);
        examsList[index] = data;
        this.setState({
          examsList
        })
      }).catch((err) => {
        console.log(err)
      });
    } else {
      createExams(data).then((res) => {
        const mergeData = Object.assign(data, res);
        examsList.push(mergeData);
        this.setState({
          examsList
        })
      }).catch((err) => {
        console.log(err)
      });
    }
    this.setState({
        testId: '',
        testTitle: '',
        isAttachmentRequired: false,
        questions: [{
          name: ''
        }],
    });
    this.handleModal()
  }

  handleSortChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  render() {
    const {examStatusList} = this.state;
    let {sortedInfo} = this.state;
    sortedInfo = sortedInfo || {};
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Action',
        dataIndex: '',
        render: (text, status) =>
          <div className="form-inline">
            <button className="btn btn-danger btn-sm mr-1" onClick={() => this.removeExam(status.id)}>Delete</button>
            <button className="btn btn-blue btn-sm" onClick={() => this.handleModal(status)}>Edit</button>
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
      <div className="manage-status">
        <div className="row col-sm-8 col-md-8 col-sm-offset-2 col-md-offset-2 col-xs-12">
          <div className='col-sm-12 text-right'>
            <button className="btn btn-blue mb-2" onClick={() => this.handleModal()}>Create New Status</button>
          </div>
          <div className="col-sm-12 col-md-12 col-xs-12">
            <Table columns={columns} dataSource={examStatusList} onChange={this.handleSortChange}/>
          </div>
        </div>
        <ExamStatusModal
          handleModal={this.handleModal}
          onChange={this.onChange}
          state={this.state}
          removeQuestion={this.removeQuestion}
          addQuestion={this.addQuestion}
          onQuestion={this.onQuestion}
          saveExam={this.saveExam}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageStatus);
