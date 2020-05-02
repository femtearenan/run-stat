export const REQUEST_DATA = "REQUEST_DATA";
export const RESOLVED_GET_DATA = "RESOLVED_GET_DATA";
export const FAILED_GET_DATA = "FAILED_GET_DATA";

export const getData = () => {

    return function (dispatch) {
        dispatch(requestData());

        return fetch('https://femtearenan.se/api/runs.json')
            .then(response => response.json(), error => console.log('An error occured: ', error))
            .then(json => dispatch(resolvedGetData(json)));
    }
}

export const requestData = () => {
    return {
        type: REQUEST_DATA
    }
}

export const resolvedGetData = (json) => {
    return {
        type: RESOLVED_GET_DATA,
        payload: {
            data: json
        }
    }
}

