import socketIOClient from "socket.io-client";

const URI = 'https://endless-trivia-be.herokuapp.com/';

class Socket {
    constructor() {
        this.socket = socketIOClient(URI);
    }

    getSocket() {
        return this.socket;
    }
}

export default Socket;