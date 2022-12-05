import _ from 'lodash';

import * as actionTypes from '../actions/actionTypes.js';

const initialState = {
    userId: null,
    email: null,
    displayName: null,
    role: null
};

const reducer = (state = initialState, action) => {
    const currentState = _.cloneDeep(state);
    switch (action.type) {
        case (actionTypes.AUTHENTICATED):
            return {
                ...currentState,
                userId: action.userId,
                email: action.email,
                displayName: action.displayName,
                role: action.role
            };
        case (actionTypes.LOGOUT):
            return {
                ...currentState,
                userId: null,
                email: null,
                displayName: null,
                role: null
            };
        case (actionTypes.CHANGE_DISPLAY_NAME):
            return {
                ...currentState,
                displayName: action.displayName
            };
        default: return state;
    }
};

export default reducer;