import {
    SET_SESSION_TEST_LIST,
    SET_SOURCES_LIST,
    SET_ERROR,
    SET_EXAMS_LIST_ERROR,
    SET_SOURCES_LIST_ERROR,
    REMOVE_ERROR,
    SET_EXAMS_LIST_LOADING
} from '../actions/ActionTypes'

const initialState = {
    tests: [],
    sources: [],
    error:{
        sourceError:'',
        sessionTestsError:'',
        ExamsListError:'',
        getStatusListError:'',
    },
    successMsg:'',
    sessionError:[],
    errorMessage:[],
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
        case SET_EXAMS_LIST_ERROR:
            return {
                ...state,
                examListErrorMessage: [
                    ...state.errorMessage,
                    action.payload.sessionTestsErr,
                ]
            };
        case SET_SOURCES_LIST_ERROR:
            return {
                ...state,
                sourcesListErrorMessage: [
                    ...state.errorMessage,
                    action.payload.sourcesListError,
                ]
            };
        case REMOVE_ERROR:
            return{
                ...state,
                error:{...initialState.error},
                successMsg:''
            };
        default:
            return state
    }
}
