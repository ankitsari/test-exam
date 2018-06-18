import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {getTestById} from "../../../utils/_data";
import Loader from '../../Common/Loader'
import {notification} from 'antd'

class View extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      test: {}
    }
  }

    notifyError = (err) => {
        notification.error({
            message: err.message || 'Please try again.',
            placement: 'topRight',
        })
    }


  componentWillMount() {
    const {params} = this.props.match;
    const testId = params && params.testId;
    if (testId) {
      getTestById(testId).then((res) => {
        this.setState({
          test: res || {},
          loading: false,
        })
      }).catch((err) => {
        this.notifyError(err);
          this.setState({
              loading: false,
              test: {}
          })
      })
    }
  }

  render() {
      const {test} = this.state;
    const loading = (
      <Loader/>
    );

    if (this.state.loading) {
      return loading
    }
    return (
      <div className="container admin-view">
        <div className="text-left mt-3">
          <h2>View</h2>
        </div>
        <hr/>
        <div className="row mt-2">
          <div className=' col-md-8 offset-sm-2'>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Name:</label>
              </div>
              <div className='col-sm-8'>
                {test.name}
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Created At:</label>
              </div>
              <div className='col-sm-8'>
                {test.dateCreated}
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Test Start:</label>
              </div>
              <div className='col-sm-8'>
                {test.testStart}
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Test End:</label>
              </div>
              <div className='col-sm-8'>
                {test.testEnd}
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Time Taken:</label>
              </div>
              <div className='col-sm-8'>
                {test.timetaken}
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Status:</label>
              </div>
              <div className='col-sm-8'>
                {test.examStatus}
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Source:</label>
              </div>
              <div className='col-sm-8'>
                {test.source}
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Test Title:</label>
              </div>
              <div className='col-sm-8'>
                {test.testTitleName}
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Notes:</label>
              </div>
              <div className='col-sm-8'>
                {test.notes}
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-12'>
                <Link to={'/'}>Link to Zip file</Link>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-4'>
                <label>Code:</label>
              </div>
              <div className='col-sm-8'>
                <button className="btn btn-blue" onClick={() => window.print()}>print</button>
              </div>
            </div>
            {
                test && test.questionAndAnswerList && test.questionAndAnswerList.length ? test.questionAndAnswerList.map((answer, i) => (
                <div key={i}>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <label>Question {i+1}:</label>
                    </div>
                    <div className='col-sm-12' dangerouslySetInnerHTML={{ __html: answer.question }} />
                  </div>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <label>Answer {i+1} :</label>
                    </div>
                    <div className='col-sm-12' dangerouslySetInnerHTML={{ __html: answer.answer }} />
                  </div>
                  <hr/>
                </div>
              )): null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default View;