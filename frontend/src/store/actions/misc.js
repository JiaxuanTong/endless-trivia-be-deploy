import * as actionTypes from './actionTypes';

export const firebaseConnected = (firebase) => {
    return {
        firebase: firebase,
        type: actionTypes.FIREBASE_CONNECTED
    };
}

export const socketConnected = (socket) => {
    return {
        socket: socket,
        type: actionTypes.SOCKET_CONNECTED
    };
}

export const socketDisconnected = () => {
    return {
        type: actionTypes.SOCKET_DISCONNECTED
    };
}