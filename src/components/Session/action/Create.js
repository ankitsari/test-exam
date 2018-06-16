import React, {Component} from 'react';
import AbstractForm from '../components/AbstractForm';
import {connect} from 'react-redux';
import {notification} from 'antd'
import {getAllExamsList, getSourceList} from "../../../utils/_data"

const mapStateToProps = state => ({
  sources: (state.tests && state.tests.sources) || [],
});

const mapDispatchToProps = dispatch => ({
});

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: {},
      exams: [],
        sources: [],
    }
  }

  notifyError = (err) => {
      notification.error({
          message: err.message || 'Please try again.',
          placement: 'topRight',
      })
  }
 async componentWillMount() {
     try {
         const {exams, sources} = await Promise.all([
             getAllExamsList(),
             getAllExamsList()
         ])
         this.setState({
             exams: exams || [],
             sources: sources || []
         })
     } catch (err) {
       this.notifyError(err);
       this.setState({
             exams: [{
                 id: 1,
                 name: "test",
                 examStatus: 1,
                 notes: '',
                 source: 1,
                 timetaken: '',
                 testEnd: '',
                 testStart: '',
                 dateCreated: ''
             },{
                 id: 1,
                 name: "test",
                 examStatus: 1,
                 notes: '',
                 source: 1,
                 timetaken: '',
                 testEnd: '',
                 testStart: '',
                 dateCreated: ''
             }],
             sources: [{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'}],
         })

     }
 }

  getExams = () => {
    getAllExamsList().then(res => {
      this.setState({
        exams: res || []
      })
    }).catch(err => {
        this.notifyError(err);
    })
  }

  getSource = () => {
      getSourceList().then(res => {
          this.setState({
              sources: res || []
          })
      }).catch(err => {
        this.state({
            examStatusList: [{id: 1, name: 'hide'},{id: 2, name: 'show'}],
            sources: [{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'},{id: 1, name: 'upwork'}],
        })
          this.notifyError(err);
      })
  }

    render() {
    return <AbstractForm label={'Create'} exams={this.state.exams} sources={this.state.sources}/>;
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);