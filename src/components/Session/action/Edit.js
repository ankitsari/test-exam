import React, {Component} from 'react';
import AbstractForm from '../components/AbstractForm';
import { connect } from 'react-redux';
import { getSourcesList } from '../../../Redux/actions/index'
import { getTestByIdForEdit, getAllExamsList, getExamStatusList, getSourceList } from "../../../utils/_data";
import Loader from '../../Common/Loader'
import {notification} from 'antd'

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

    notifyError = (err) => {
        notification.error({
            message: err.message || 'Please try again.',
            placement: 'topRight',
        })
    }

    async componentWillMount() {
        const {params} = this.props.match;
        const testId = params && params.id;
        try{
            const [allExams, statusList, sourceList, test] = await Promise.all([
                getAllExamsList(),
                getExamStatusList(),
                getSourceList(),
                getTestByIdForEdit(testId)
            ]);
            this.setState({
                exams: allExams,
                examStatusList: statusList,
                sources: sourceList.data,
                test: test || {},
                testId,
                loading: false,
            })
        }catch(err) {
            this.notifyError(err);
            this.setState({
                loading: false,
            })
        }
    }

    render() {
        const { test, testId } = this.state;
        const loading = (
          <Loader/>
        );

        if (this.state.loading) {
            return loading
        }
        return <AbstractForm label={'Edit'} history={this.props.history} testId={testId} exams={this.state.exams} examStatusList={this.state.examStatusList} sources={this.state.sources} formData={test} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);