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
        const pathname = window.location.pathname;
        const token = pathname.split('/')[2];
        if(token) {
            checkValidateToken(token).then((res) => {
                if(res && res.firstName) {
                    this.setState({
                      user: res,
                      loading: false,
                    })
                }else {
                    this.setState({
                      error: 'Token Invalid',
                      loading: false,
                    })
                }

            }).catch(err => {
              this.setState({
                error: err.response.data,
                loading: false,
              })
            });
        }
    }

    handleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }
    render() {
      const {modal, user, error} = this.state;
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
                <h3 className="text-center">Refresh token invalid or expired</h3>
                { error && <p className='text-center text-danger'>{error}</p> }
              </div>
            }
        </div>
      );
    }
}

export default TakeTest;