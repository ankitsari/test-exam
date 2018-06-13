import { applyMiddleware, createStore, compose } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

const getMiddleware = () => {

  if ( process.env.NODE_ENV === 'production' ) {

    return [ thunk ]

  }
  // Enable additional logging in non-production environments.
  return [ thunk, logger ]

}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const preLoadedState = {}

const store = createStore(
  rootReducer,
  preLoadedState,
  composeEnhancers( applyMiddleware( ...getMiddleware() ) ),
)

export default store
