import { combineReducers } from 'redux'
import exams from './exams'
import tests from './tests'

export default combineReducers( {
  exams,
  tests,
} )
