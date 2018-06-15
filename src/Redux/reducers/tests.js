import {
    SET_SESSION_TEST_LIST,
    SET_SOURCES_LIST,
    SET_ERROR
} from '../actions/ActionTypes'

const initialState = {
    tests: [],
    sources: [],
    error:{}
}

export default ( state = initialState, action ) => {
    switch ( action.type ) {

        case SET_SESSION_TEST_LIST:
            return {
                ...state,
                tests: action.payload,
            };
        case SET_SOURCES_LIST:
            return {
                ...state,
                sources: action.payload,
            };
        case SET_ERROR:
            return{
                ...state,
                error:{
                    sourceError:action.payload.sourcesList,
                    sessionTestsError:action.payload.sessionTests,
                    ExamsListError:action.payload.ExamsListError,
                    getStatusListError:action.payload.getStatusListError,
                }
            };
        default:
            return state
    }
}
