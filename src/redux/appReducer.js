import {REQUEST_DATA, RESOLVED_GET_DATA, FAILED_GET_DATA, CHANGE_VIEW, views, SET_STATISTIC, STATISTIC_CHOICES} from './actions';
import * as d3r from 'd3-regression';


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
    },
    statistic: {
        combined: [],
        normal: [],
        intervals: []
    },
    activeStatistic: {
        type: "combined",
        data: []
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
                const linearFunc = d3r.regressionLinear()
                    .x(d => d.distance)
                    .y(d => d.weightDiff);
                
                const normalRuns = runData.filter(d => d.type === "/api/run_types/1");
                const intervalRuns = runData.filter(d => d.type === "/api/run_types/2");
                const combined = linearFunc(runData);
                const normal = linearFunc(normalRuns);
                const intervals = linearFunc(intervalRuns);
                const statistic = {
                    combined: combined,
                    normal: normal,
                    intervals: intervals
                }
                action.payload.data = runData;
                return Object.assign({}, state, {
                    requests: requests,
                    status: status,
                    isFetching: false,
                    isOK: isOK,
                    [action.dataType]: action.payload.data,
                    statistic: statistic,
                    activeStatistic: {
                        type: "combined",
                        data: combined
                    }
                });
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
        case SET_STATISTIC:
            if (action.payload.type === STATISTIC_CHOICES[1]) {
                return Object.assign({}, state, {
                    activeStatistic: {
                        type: action.payload.type,
                        data: state.statistic.normal
                    }
                })
            } else if (action.payload.type === STATISTIC_CHOICES[2]) {
                return Object.assign({}, state, {
                    activeStatistic: {
                        type: action.payload.type,
                        data: state.statistic.intervals
                    }
                })
            } else {
                return Object.assign({}, state, {
                    activeStatistic: {
                        type: action.payload.type,
                        data: state.statistic.combined
                    }
                })
            }
            

        default: 
            return state;
    }
}

export default appReducer;