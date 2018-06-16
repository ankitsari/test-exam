import {
    SET_SESSION_TEST_LIST,
    SET_SOURCES_LIST,
    SET_ERROR,
    REMOVE_ERROR
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
    successMsg:''
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
                    sourceError:action.payload.sourcesList || '',
                    sessionTestsError:action.payload.sessionTests || '',
                    ExamsListError:action.payload.ExamsListError || '',
                    getStatusListError:action.payload.getStatusListError || '',
                },
            };
        case REMOVE_ERROR:
            return{
                ...state,
                error:{...initialState.error},
                successMsg:''
            }
        default:
            return state
    }
}
