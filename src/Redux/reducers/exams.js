import {
  SET_EXAMS_LIST,
} from '../actions/ActionTypes'

const initialState = {
  exams: [],
}

export default ( state = initialState, action ) => {

  switch ( action.type ) {

  case SET_EXAMS_LIST:
    return {
      ...state,
      exams: action.payload,
    }
  default:
    return state

  }

}
