import {
    getExamsList,
    getTestsList,
    getSourceList,
} from '../../utils/_data';
import {
    SET_EXAMS_LIST,
    SET_SESSION_TEST_LIST,
    SET_SOURCES_LIST
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