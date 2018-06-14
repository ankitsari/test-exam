import React, {Component} from 'react';
import {connect} from 'react-redux';
import swal from 'sweetalert';
import {bindActionCreators} from 'redux';
import { Table } from 'antd'
import {getAllStatusList,createStatus,editStatus,deleteStatus} from '../../Redux/actions'
import StatusModal from './components/StatusModal'
import Loader from '../Common/Loader'
import '../ManageExamination/index.css'
import 'antd/dist/antd.css'

const mapStateToProps = state => ({
  statusList: state.status.status,
  loading: state.loading
});

const mapDispatchToProps = dispatch => ({
    fetchStatus: bindActionCreators(getAllStatusList,dispatch),
    createStatus: bindActionCreators(createStatus,dispatch),
    editStatus: bindActionCreators(editStatus,dispatch),
    deleteStatus: bindActionCreators(deleteStatus,dispatch)
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
      this.props.fetchStatus();
  }

  removeExam = (statusId) => {
    const {statusList} = this.state;
    if (statusId) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this status",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((status) => {
        if (status) {
          this.props.deleteStatus(statusId,statusList);
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

  saveStatus = () => {
    const {statusId, name,statusList} = this.state;
    let err = this.validate('name',name);
    if(err){
      this.setState({error:err});
      return
    }
    const data = { Name: name }
    if(statusId){
      data.Id = statusId
      this.props.editStatus(data,statusList);
    }else {
        this.props.createStatus(data);
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
