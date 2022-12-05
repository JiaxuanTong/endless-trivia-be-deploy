import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes.js';

const initialState = {
    lobbyId: null
};

const reducer = (state = initialState, action) => {
    const currentState = _.cloneDeep(state);
    switch (action.type) {
        case (actionTypes.LOBBY_JOINED):
            return {
                ...currentState,
                lobbyId: action.lobbyId
            };
        case (actionTypes.LOBBY_LEFT):
            return {
                ...currentState,
                lobbyId: null
            };
        default: return state;
    }
};

export default reducer;