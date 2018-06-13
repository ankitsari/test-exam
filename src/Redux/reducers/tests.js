import {
    SET_SESSION_TEST_LIST,
    SET_SOURCES_LIST
} from '../actions/ActionTypes'

const initialState = {
    tests: [],
    sources: [],
}

export default ( state = initialState, action ) => {

    switch ( action.type ) {

        case SET_SESSION_TEST_LIST:
            return {
                ...state,
                tests: action.payload,
            }
        case SET_SOURCES_LIST:
            return {
                ...state,
                sources: action.payload,
            }
        default:
            return state

    }

}
