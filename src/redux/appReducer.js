import {REQUEST_DATA, RESOLVED_GET_DATA, FAILED_GET_DATA} from './actions'

const INITIALIZING = "Initializing";
const FETCHING = "Fetching";
const FAILED = "Failed";
const OK = "OK";

const initialState = {
    status: INITIALIZING,
    isFetching: false,
    isOK: false,
    data: []
}

function appReducer(state = initialState, action) {
    switch(action.type) {
        case REQUEST_DATA:
            return Object.assign({}, state, {
                status: FETCHING,
                isFetching: true,
            });
        case FAILED_GET_DATA:
            return Object.assign({}, state, {
                status: FAILED,
                isFetching: false,
            });
        case RESOLVED_GET_DATA:
            return Object.assign({}, state, {
                status: OK,
                isFetching: false,
                isOK: true,
                data: action.payload.data
            });
        default: 
            return state;
    }
}

export default appReducer;