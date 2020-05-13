import {REQUEST_DATA, RESOLVED_GET_DATA, FAILED_GET_DATA, CHANGE_VIEW, views} from './actions';


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
    categories: [],
    currentView: {
        basic: "display",
        analyses: "none",
        meta: "none"
    }
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

            if (action.dataType === "runData") {
                const runData = action.payload.data.map(d => {
                    return Object.assign({}, d, {
                        date:  new Date(d.date),
                        time: new Date(d.time.toLocaleString().slice(0, 19))
                    });
                });
                action.payload.data = runData;
            }
            

            return Object.assign({}, state, {
                requests: requests,
                status: status,
                isFetching: false,
                isOK: isOK,
                [action.dataType]: action.payload.data
            });
        case CHANGE_VIEW:
            let currentView = null;
            if (action.payload.view === views[0]) {
                currentView = {
                    basic: "display",
                    analyses: "none",
                    meta: "none"
                }
            } else if (action.payload.view === views[1]) {
                currentView = {
                    basic: "none",
                    analyses: "display",
                    meta: "none"
                }
            } else {
                currentView = {
                    basic: "none",
                    analyses: "none",
                    meta: "display"
                }
            }
            
            return Object.assign({}, state, {
                currentView: currentView
            })

        default: 
            return state;
    }
}

export default appReducer;