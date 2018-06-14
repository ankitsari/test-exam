import _ from 'lodash';
import {
    getExamsList,
    getTestsList,
    getSourceList,
    getStatusList,
    addStatus,
    updateStatus,
    removeStatus
} from '../../utils/_data';
import {
    SET_EXAMS_LIST,
    SET_SESSION_TEST_LIST,
    SET_SOURCES_LIST,
    SET_STATUS_LIST,
    ADD_STATUS,
    EDIT_STATUS,
    DELETE_STATUS
} from './ActionTypes'

export const getExams = payload => ( {
  type: SET_EXAMS_LIST,
  payload,
} )

export const getManageExamsList = (dispatch) => () => {

  getExamsList().then( ( res ) => {
    dispatch( getExams( res ) )
  } )

}


export const getSessionTests = payload => ( {
    type: SET_SESSION_TEST_LIST,
    payload,
} )

export const getSessionTestsList = (dispatch) => () => {

    getTestsList().then( ( res ) => {
        dispatch( getSessionTests( res ) )
    } )

}


// common

export const getSources = payload => ( {
    type: SET_SOURCES_LIST,
    payload,
} )

export const getSourcesList = (dispatch) => () => {

    getSourceList().then( ( res ) => {
        dispatch( getSources( res ) )
    } )

}

export const getStatuses = payload => ({
    type: SET_STATUS_LIST,
    payload,
})

export const getAllStatusList = (dispatch) => {
    return (dispatch) => {
        getStatusList().then( ( res ) => {
            dispatch( getStatuses( res ) )
        })
    }
}

export const addStatuses = payload => ({
    type: ADD_STATUS,
    payload
})

export const createStatus = (data) => {
    return (dispatch) => {
        addStatus(data).then( (res) => {
            const newStatus = {
                id: res.testId,
                name: res.testTitle,
                isActive: true,
            };
            dispatch( addStatuses(newStatus))
        })
    }
}

export const editStatuses = payload => ({
    type: EDIT_STATUS,
    payload
})

export const editStatus = (data,status) => {
    return (dispatch) => {
        updateStatus(data).then( (res) => {
            let indexToEdit = _.findIndex(status,(s => s.id === data.Id))
            status[indexToEdit] = {
                id: data.Id,
                name: data.Name,
                isActive: true
            }
            dispatch( editStatuses(status))
        })
    }
}

export const deletedStatus = payload =>({
    type: DELETE_STATUS,
    payload
})

export const deleteStatus = (id,status) => {
    return (dispatch) => {
        removeStatus(id).then( (res) => {
            let indexToRemove = _.findIndex(status,(s => s.id === id))
            status.splice(indexToRemove,1);
            dispatch( deletedStatus(status));
        })
    }
}