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
         const [exams, res] = await Promise.all([
             getAllExamsList(),
             getSourceList()
         ]);

         this.setState({
             exams: exams || [],
             sources: res.data || []
         })
     } catch (err) {
       this.notifyError(err);
     }
 };

    render() {
    return <AbstractForm label={'Create'} exams={this.state.exams} sources={this.state.sources}/>;
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);