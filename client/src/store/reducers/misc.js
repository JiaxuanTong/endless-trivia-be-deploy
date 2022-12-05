import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes.js';

const initialState = {
    firebase: null,
    socket: null
};

const reducer = (state = initialState, action) => {
    const currentState = _.cloneDeep(state);
    switch (action.type) {
        case (actionTypes.FIREBASE_CONNECTED):
            return {
                ...currentState,
                firebase: action.firebase
            };
        case (actionTypes.SOCKET_CONNECTED):
            return {
                ...currentState,
                socket: action.socket
            };
        case (actionTypes.SOCKET_DISCONNECTED):
            if (currentState.socket)    currentState.socket.getSocket().disconnect();
            return {
                ...currentState,
                socket: null
            };
        default: return state;
    }
};

export default reducer;