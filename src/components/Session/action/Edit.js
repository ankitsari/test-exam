import React, {Component} from 'react';
import AbstractForm from '../components/AbstractForm';
import { connect } from 'react-redux';
import { getSourcesList } from '../../../Redux/actions/index'
import { getTestByIdForEdit, getAllExamsList, getExamStatusList } from "../../../utils/_data";
import Loader from '../../Common/Loader'

const mapStateToProps = state => ({
    sources: (state.tests && state.tests.sources) || [],
});

const mapDispatchToProps = dispatch => ({
    fetchSources: dispatch(getSourcesList),
});
class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: {},
            loading: true,
            exams: [],
            examStatusList: [],
            testId: '',
        }
    }

    componentWillMount() {
        this.props.fetchSources();
        this.getExams();
        this.getExamStatus();
        const testId = this.props.history.location.state && this.props.history.location.state.testId;
        if(testId) {
            getTestByIdForEdit(testId).then((res) => {
                this.setState({
                    test: res || {},
                    testId,
                    loading: false,
                })
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    getExams = () => {
        getAllExamsList().then(res => {
            this.setState({
                exams: res || []
            })
        }).catch(err =>{})
    }

    getExamStatus = () => {
        getExamStatusList().then(res => {
            this.setState({
                examStatusList: res || []
            })
        }).catch(err =>{})
    }

    render() {
        const { test, testId } = this.state;
        const loading = (
          <Loader/>
        );

        if (this.state.loading) {
            return loading
        }
        return <AbstractForm label={'Edit'} history={this.props.history} testId={testId} exams={this.state.exams} examStatusList={this.state.examStatusList} sources={this.props.sources} formData={test} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);