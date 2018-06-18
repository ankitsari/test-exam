import _ from 'lodash';
import {
    SET_STATUS_LIST,
    ADD_STATUS,
    EDIT_STATUS,
    DELETE_STATUS,
    SET_STATUS_ERROR,
    START_REQUEST
} from '../actions/ActionTypes'
const initialState = {
    loading: false,
    status: [],
    successMsg:''
}

export default ( state = initialState, action ) => {
    switch ( action.type ) {
        case SET_STATUS_LIST:
            return {
                ...state,
                status: action.payload,
                loading: false,
                successMsg:'Successfully fetched status list...!'
            }
        case START_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case ADD_STATUS:
            return {
                ...state,
                loading: false,
                status:[...state.status,action.payload],
                successMsg:'Successfully Added Status...!'
            }
        case EDIT_STATUS:
            const statusUpdate = _.cloneDeep(action.payload);
            return {
                ...state,
                loading: false,
                status: statusUpdate,
                successMsg:'Successfully Updated Status ...!'
            };
        case DELETE_STATUS:
            const statusDelete = _.cloneDeep(action.payload);
            return {
                ...state,
                status: statusDelete,
                loading: false,
                successMsg:'Successfully Deleted Status...!'
            }
        case SET_STATUS_ERROR: {
            return {
                ...state,
                successMsg:'',
                loading: false,
                errorMsg: action.payload.getStatusListError
            }
        }
        default:
            return state

    }
}
