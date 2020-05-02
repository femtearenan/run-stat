import {REQUEST_DATA, RESOLVED_GET_DATA, FAILED_GET_DATA} from './actions'

const INITIALIZING = "Initializing";
const FETCHING = "Fetching";
const FAILED = "Failed";
const OK = "OK";

const initialState = {
    requests: 0,
    status: INITIALIZING,
    isFetching: false,
    isOK: false,
    runData: [],
    typeData: [],
    categories: []
}

function appReducer(state = initialState, action) {
    switch(action.type) {
        case REQUEST_DATA:
            return Object.assign({}, state, {
                requests: state.requests + 1,
                status: FETCHING,
                isFetching: true,
            });
        case FAILED_GET_DATA:
            return Object.assign({}, state, {
                status: FAILED,
                isFetching: false,
            });
        case RESOLVED_GET_DATA:
            let requests = state.requests - 1;
            let status = requests === 0? OK: FETCHING;
            let isOK = requests === 0;

            return Object.assign({}, state, {
                requests: requests,
                status: status,
                isFetching: false,
                isOK: isOK,
                [action.dataType]: action.payload.data
            });
        default: 
            return state;
    }
}

export default appReducer;