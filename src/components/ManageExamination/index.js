import React from 'react';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import {Table, notification} from 'antd'
import {getManageExamsList} from '../../Redux/actions/index'
import {deleteExamsById, editExamById, createExams, updateExam, getExamsList} from "../../utils/_data";
import ExamModal from './components/ExamModal'
import Loader from '../Common/Loader'
import './index.css'
import 'antd/dist/antd.css'

const mapStateToProps = state => ({
  errorMsg : state.tests && state.tests.error,
  examsList: state.exams && state.exams.exams,
});

const mapDispatchToProps = dispatch => ({
  fetchExams: dispatch(getManageExamsList),
});

class ManageExam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isModal: false,
      testTitle: '',
      isAttachmentRequired: false,
      questions: [{
        name: ''
      }],
      errors: {
        testTitle: '',
        questions: '',
      },
      examsList: [],
      sortedInfo: {
        order: 'descend',
        columnKey: '',
      },
      sortList: false,
    }
  }

  async componentWillMount() {
      try {
        const resExams = await getExamsList();
          const examsList = resExams && resExams.data && resExams.data.map(x => {
              x.key = x.testId;
              return x
          });
          this.setState({
              examsList: examsList || [],
              loading: false,
          })
      } catch(er) {
          this.notifyError(er);
          this.setState({
              // examsList: [{testTitle: 'test', key: 1, testId: 1}],
              loading: false,
          });
      }
  }

  notifyError = (err) => {
      notification.error({
          message: err.message || 'Please try again.',
          placement: 'topRight',
      })
  }

  notifySuccess = (message) => {
        notification.success({
            message: message,
            placement: 'topRight',
        })
    }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.examsList) {
  //     const examsList = nextProps.examsList.map(x => {
  //       x.key = x.testId
  //       return x
  //     })
  //     this.setState({
  //       examsList,
  //       loading: false
  //     })
  //   }
  // }

  removeExam = (TestId) => {
    const {examsList} = this.state;
    if (TestId) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this exam details",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((status) => {
        if (status) {
          deleteExamsById(TestId).then(() => {
            let index = examsList.findIndex(x => x.testId === TestId);
            examsList.splice(index, 1);
            this.setState({
              examsList
            });
            swal("Your exam details has been deleted!", {
              icon: "success",
            });
              this.notifySuccess("Your exam details has been deleted!")
          }).catch((err) => {
              this.notifyError(err)
          })
        }
      });
    }
  };

  handleModal = (exam) => {
    if (exam && exam.testId) {
      this.setState({
        loading: true
      }, () => {
        editExamById(exam.testId).then(res => {
          this.setState({
            ...res,
            isModal: !this.state.isModal,
            loading: false
          });
        }).catch(er => {
            this.notifyError(er);
            this.setState({
                loading: false,
            })
        });
      })
    } else {
      this.setState({
        isModal: !this.state.isModal,
        testId: '',
        testTitle: '',
        isAttachmentRequired: false,
        questions: [{
          name: ''
        }],
        errors:{}
      });
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  isChecked = (e) => {
    this.setState({
        isAttachmentRequired: e.target.checked,
    })
  };

  onQuestion = (e, i) => {
    const {questions} = this.state;
    questions[i].name = e.editor.getData();
    this.setState({
        questions,
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
      case 'questions':
        if (!value) {
          return ' field is required';
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
          this.notifySuccess("Your exam details has been updated!")
      }).catch((er) => {
          this.notifyError(er)
        console.log(er)
      });
    } else {
      createExams(data).then((res) => {
        const mergeData = Object.assign(data, res);
        examsList.push(mergeData);
        this.setState({
          examsList
        })
          this.notifySuccess("Your exam details has been created!")
      }).catch((er) => {
          this.notifyError(er)
          return;
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
  };

  addQuestion = () => {
      const {questions} = this.state;
      const inserted = {
        name: '',
        isNew: true,
      };
      questions.push(inserted);
      this.setState({
          questions
      })
  };

  removeQuestion = () => {
      const {questions} = this.state;
      questions.pop();
      this.setState({
          questions
      })
  };

  handleSortChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  render() {
    const {examsList} = this.state;
    let {sortedInfo} = this.state;
    sortedInfo = sortedInfo || {};
    const columns = [
      {
        title: 'Name',
        dataIndex: 'testTitle',
        sorter: (a, b) => a.testTitle.toLowerCase().localeCompare(b.testTitle.toLowerCase()),
        sortOrder: sortedInfo.columnKey === 'testTitle' && sortedInfo.order,
      },
      {
        title: 'Action',
        dataIndex: '',
          className: 'text-right',
        render: (text, exam) =>
          <div className="form-inline pull-right">
            <button className="btn btn-blue btn-sm mr-1" onClick={() => this.handleModal(exam)}>Edit</button>
            <button className="btn btn-danger btn-sm " onClick={() => this.removeExam(exam.testId)}>Delete</button>
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
      <div className="manage-exam">
        <div className="row col-sm-12 col-md-12 col-xs-12">
          <div className='col-sm-12 text-right'>
              <button className="btn btn-blue mb-2" onClick={() => this.handleModal()}>Create New Test</button>
          </div>
          <div className="col-sm-12 col-md-12 col-xs-12">
            <span style={{color:"red"}}>{this.props.errorMsg.ExamsListError}</span>
            <Table columns={columns} dataSource={examsList} onChange={this.handleSortChange}/>
          </div>
        </div>
        <ExamModal
          handleModal={this.handleModal}
          onChange={this.onChange}
          isChecked={this.isChecked}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageExam);
