let Lobby = require("../classes/lobby.js");
let LobbyUser = require("../classes/lobbyUser.js");
const socketEvents = require("../constants/socketEvents.js");

module.exports = {
    handleChat: (socket, io) => {
        // Required user, lobbyid, and the message in text
        // user contains id, name, and color
        // message is just the plain text message
        socket.on(socketEvents.SEND_MESSAGE_C, ({ arg_user, arg_lobbyid, arg_message }, callback) => {
            let timestamp = new Date();
            io.to(arg_lobbyid).emit(socketEvents.SEND_MESSAGE_S,
                {
                    user: arg_user,
                    text: arg_message,
                    time: `${timestamp}`
                });
            callback();
        });
    }
}