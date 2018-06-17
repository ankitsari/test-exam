import React, {Component} from 'react';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import {bindActionCreators} from 'redux';
import { Table,notification } from 'antd'
import {
    getAllStatusList,
    createStatus,
    editStatus,
    deleteStatus,
    initialError
} from '../../Redux/actions'
import {getStatusList,addStatus,updateStatus,removeStatus} from "../../utils/_data";
import StatusModal from './components/StatusModal'
import Loader from '../Common/Loader';
import '../ManageExamination/index.css'
import 'antd/dist/antd.css'
import _ from "lodash";

const mapStateToProps = state => ({
  statusList: state.status.status,
  loading: state.loading,
  errorMsg: state.error.getStatusListError || '',
  successMsg: state.successMsg || ''
});

const mapDispatchToProps = dispatch => ({
    fetchStatus: bindActionCreators(getAllStatusList,dispatch),
    createStatus: bindActionCreators(createStatus,dispatch),
    editStatus: bindActionCreators(editStatus,dispatch),
    deleteStatus: bindActionCreators(deleteStatus,dispatch),
    removeError: bindActionCreators(initialError,dispatch),
});

class ManageStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      isModal: false,
      name: '',
      error: '',
      statusList: [],
      sortedInfo: {
        order: 'descend',
        columnKey: '',
      },
      sortList: false,
    }
  }

  componentWillMount() {
      this.fetchStatus();
  }

  fetchStatus = async() => {
      try{
        const data = await getStatusList();
        this.setState({statusList:data.status});
      }catch (err) {
          this.notifyError(err)
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

  removeExam = (statusId) => {
    if (statusId) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this status",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((status) => {
        if (status) {
          this.deleteStatus(statusId);
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
        error:''
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
      case 'name':
        if (!value) {
          return 'Status Title is Required';
        } else {
          return '';
        }
      default: {
        return ''
      }
    }
  };

  createStatus = async(data) => {
    try{
      const res = await createStatus(data);
      this.setState((state)=>({statusList:[...state.statusList,res]}));
      this.notifySuccess('Successfully Added Status...!');
    }catch (err) {
      this.notifyError(err)
    }
  }

  editStatus = async(data) => {
    try{
        let {statusList} = this.state;
        const res = await updateStatus(data);
        let indexToEdit = _.findIndex(statusList,(s => s.id === data.Id))
        statusList[indexToEdit] = {
            id: data.Id,
            name: data.Name,
            isActive: true
        }
        this.setState({statusList});
        this.notifySuccess('Successfully Updated Status ...!');
    }catch (err) {
        this.notifyError(err);
    }
   }

   deleteStatus = async(data) => {
    try{
      let {statusList} = this.state;
      const res = await removeStatus(data);
      let indexToRemove = _.findIndex(statusList,(s => s.id === data))
      statusList.splice(indexToRemove,1);
      this.setState({statusList});
      this.notifySuccess('Successfully Deleted Status...!');
    }catch (err) {
      this.notifyError(err);
    }
   }

  saveStatus = () => {
    const {statusId, name} = this.state;
    let err = this.validate('name',name);
    if(err){
      this.setState({error:err});
      return
    }
    const data = { Name: name }
    if(statusId){
      data.Id = statusId
      this.editStatus(data);
    }else {
      this.createStatus(data);
    }
    this.handleModal();
  }

  handleSortChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({statusList:nextProps.statusList,loading:nextProps.loading});
  }

  render() {
    const {statusList,loading} = this.state;
    let {sortedInfo} = this.state;
    sortedInfo = sortedInfo || {};
    const { errorMsg, successMsg} = this.props;
    let message = errorMsg ? errorMsg : successMsg;
    let type = errorMsg ? 'error' : 'success';
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

    if (loading)
      return(
        <Loader/>
      )
    return (
      <div className="manage-status">
        <div className="row col-sm-8 col-md-8 col-sm-offset-2 col-md-offset-2 col-xs-12">
          <div className='col-sm-12 text-right'>
            <button className="btn btn-blue mb-2" onClick={() => this.handleModal()}>Create New Status</button>
          </div>
          <div className="col-sm-12 col-md-12 col-xs-12">
            <span style={{color:"red"}}>{this.props.errorMsg.getStatusListError}</span>
            <Table columns={columns} dataSource={statusList} onChange={this.handleSortChange}/>
          </div>
        </div>
        <StatusModal
          handleModal={this.handleModal}
          onChange={this.onChange}
          state={this.state}
          saveStatus={this.saveStatus}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageStatus);
