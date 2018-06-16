import _ from 'lodash';
import {
    SET_STATUS_LIST,
    ADD_STATUS,
    EDIT_STATUS,
    DELETE_STATUS
} from '../actions/ActionTypes'
const initialState = {
    loading:false,
    status: [],
    successMsg:''
}

export default ( state = initialState, action ) => {
    switch ( action.type ) {
        case SET_STATUS_LIST:
            return {
                ...state,
                status: action.payload,
                loading:false,
                successMsg:'Successfully fetched status list...!'
            }
        case ADD_STATUS:
            return {
                ...state,
                status:[...state.status,action.payload],
                successMsg:'Successfully Added Status...!'
            }
        case EDIT_STATUS:
            const statusUpdate = _.cloneDeep(action.payload);
            return {
                ...state,
                status: statusUpdate,
                successMsg:'Successfully Updated Status ...!'
            };
        case DELETE_STATUS:
            const statusDelete = _.cloneDeep(action.payload);
            return {
                ...state,
                status: statusDelete,
                successMsg:'Successfully Deleted Status...!'
            }
        default:
            return state

    }
}