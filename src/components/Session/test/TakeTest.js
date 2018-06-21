import React, {Component} from 'react';
import TakeTestModal from './TakeTestModal'
import { checkValidateToken } from "../../../utils/_data";
import Loader from '../../Common/Loader'

class TakeTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            modal: false,
            loading: true,
            user: {},
        }
    }

    componentWillMount() {
        const {params} = this.props.match;
        const token = params && params.token;
        if(token) {
            checkValidateToken(token).then((res) => {
                if (res && res.firstName) {
                    this.setState({
                        user: res,
                        loading: false,
                    })
                } else {
                    this.setState({
                        error: 'Token Invalid',
                        loading: false,
                    })
                }

            }).catch(err => {
                const message = err.response && err.response.data;
                if (message === 'Test completed') {
                    this.setState({
                        error: '',
                        successMessage: message,
                        loading: false,
                    })
                } else {
                    this.setState({
                        error: message,
                        loading: false,
                    })
                }
            });
        } else {
            this.setState({
                error: 'please contact to administrator.',
                loading: false,
            })
        }
    }

    handleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }
    render() {
      const {modal, user, error, successMessage} = this.state;
      const loading = (
        <Loader/>
      );

      if (this.state.loading) {
        return loading
      }
      return (
        <div className="container mt-3">
            {user && user.examDetailId ?
                <div>
                    <h3>{`Welcome ${user.firstName} ${user.lastName}`} </h3>
                    <div className="text-right">
                        <a className="btn-blue" onClick={this.handleModal}>Take Technical Test</a>
                    </div>
                    <TakeTestModal handleModal={this.handleModal} ExamDetailId={user.examDetailId} show={modal} />
                </div>
            : <div>
                    {
                        error ? <div data-life="2" className="alert alert-danger">
                                <strong>Error!</strong> {error}.
                            </div>
                            : successMessage &&
                            <div data-life="2" className="alert alert-success">
                                <strong>Test already taken</strong>
                            </div>
                    }
              </div>
            }
        </div>
      );
    }
}

export default TakeTest;