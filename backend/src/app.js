const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const socketEvents = require("./constants/socketEvents.js");
const index = require("./index.js");
const chatFunctions = require("./services/chat.js");
const userFunctions = require("./services/user.js");
const gameFunctions = require("./services/game.js");
const navFunctions = require('./services/navigation.js');
const lobbyFunctions = require('./services/lobbyRoom.js');
const setFunctions = require('./services/gameSetting.js');

const port = process.env.PORT || 4001;

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server, { "transports": ["websocket", "polling"] });
let lobbyList = [];

const shutdown = () => {
    console.log("Server is shutting down");

    io.sockets.emit(socketEvents.SERVER_SHUTDOWN, "Server is shutting down");
    server.close();

    process.exit(0);
};

// Socket
io.on("connection", (socket) => {
    console.log("+ Player connected");
    //For handling the navigation screen sockets
    navFunctions.handleNav(socket, io, lobbyList);
    lobbyFunctions.handleLobby(socket, io, lobbyList)
    userFunctions.handleUser(socket, io);
    gameFunctions.handleGame(socket, io,lobbyList);
    setFunctions.handleSetting(socket, io, lobbyList);
    chatFunctions.handleChat(socket, io);

    socket.on("disconnect", () => {
        gameFunctions.handlePlayerDisconnect(io, socket.userId);
        console.log(`- Player disconnected (${socket.userId})`);
        for(i in lobbyList) {
            lobbyList[i].removeUser(socket.userId);
            if (lobbyList[i].userList.length == 0) {
                lobbyList.splice(i, 1);
            }
            else {
                lobbyList[i].userList[0].host = true;
                io.to(lobbyList[i].id).emit(socketEvents.UPDATE_LOBBY, lobbyList[i]);
            }
        }
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
process.on("SIGINT", shutdown);

// AJAX
// app.set("port", process.env.PORT || 4001);
// app.use(cors({ origin: "*" }));

// app.get("/verify-user", (req, res) => {
//     userFunctions.verifyUser(req.query.userId)
//         .then(() => {
//             // If the user ID is valid
//             userFunctions.getUserInfo(req.query.userId)
//                 .then(snapshot => {
//                     if (snapshot.val()) {
//                         const userData = snapshot.val();
//                         res.send({
//                             userId: req.query.userId,
//                             email: userData.email,
//                             displayName: userData.display_name,
//                             role: userData.role
//                         });
//                     }
//                     else {
//                         // Send 404 NOT FOUND if no such user stored in the RealTime Database
//                         res.status(404).send(req.query.userId);
//                     }
//                 });
//         })
//         .catch(() => {
//             // Send 404 NOT FOUND if user ID is invalid
//             res.status(404).send(req.query.userId);
//         });
// });

// app.listen(app.get("port"));