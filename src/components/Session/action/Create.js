import React, {Component} from 'react';
import AbstractForm from '../components/AbstractForm';
import {connect} from 'react-redux';
import {getSourcesList} from '../../../Redux/actions/index'
import {getAllExamsList} from "../../../utils/_data"

const mapStateToProps = state => ({
  sources: (state.tests && state.tests.sources) || [],
});

const mapDispatchToProps = dispatch => ({
  fetchSources: dispatch(getSourcesList),
});

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: {},
      exams: []
    }
  }

  componentWillMount() {
    this.props.fetchSources();
    this.getExams();
  }

  getExams = () => {
    getAllExamsList().then(res => {
      this.setState({
        exams: res || []
      })
    }).catch(err => {
    })
  }

  render() {
    return <AbstractForm label={'Create'} exams={this.state.exams} sources={this.props.sources}/>;
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);