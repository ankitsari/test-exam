import { combineReducers } from 'redux'
import exams from './exams'
import tests from './tests'
import status from './status'

export default combineReducers( {
  exams,
  tests,
  status,
} )
