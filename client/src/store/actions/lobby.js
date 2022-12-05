import * as actionTypes from './actionTypes';

export const lobbyJoined = (lobbyId) => {
    return {
        lobbyId: lobbyId,
        type: actionTypes.LOBBY_JOINED
    };
}

export const lobbyLeft = () => {
    return {
        type: actionTypes.LOBBY_LEFT
    };
}