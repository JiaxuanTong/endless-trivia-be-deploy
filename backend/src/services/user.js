const admin = require('firebase-admin');
const serviceAccount = require("../configs/endless-trivia-1a75c-firebase-adminsdk-nc61c-9e7b47e8b9.json");
const socketEvents = require("../constants/socketEvents.js");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://endless-trivia-1a75c.firebaseio.com"
});

module.exports = {
    handleUser: (socket, io) => {
        socket.on(socketEvents.PLAYER_LOGGED_IN, (data, callback) => {
            if (!isUserAlreadyOnline(socket, io, data)) {
                console.log(`+ Player (${data.userId}) logged in`);
                callback("Success");
            }
            else {
                console.log(`- Player (${data.userId}) forced to log out because it is already online`);
                callback("User already online");
                socket.disconnect();
            }
        });
    
        socket.on(socketEvents.PLAYER_DISPLAY_NAME_CHANGED, (data) => {
            socket.displayName = data.newDisplayName;
        });

        socket.on(socketEvents.PLAYER_BANNED, (data, callback) => {
            banUser(data.userId, callback);
        });

        socket.on(socketEvents.PLAYER_UNBANNED, (data, callback) => {
            unbanUser(data.userId, callback);
        });
    },

    verifyUser: (userId) => {
        return verifyUserFromFirebase(userId);
    },
    getUserInfo: (userId) => {
        return getUserInfoFromFirebase(userId);
    }
};

const isUserAlreadyOnline = (socket, io, data) => {
    let isAlreadyOnline = false;

    const clients = io.sockets.clients();
    for (id in clients.connected) {
        if (id !== socket.id && data.userId === clients.connected[id].userId) {
            isAlreadyOnline = true;
            break;
        }
    }

    if (!isAlreadyOnline) {
        socket.userId = data.userId;
        socket.email = data.email;
        socket.displayName = data.displayName;
    }

    return isAlreadyOnline;
};

const banUser = (userId, callback) => {
    admin.auth().updateUser(userId, {
        disabled: true
    })
    .then(() => {
        admin.database().ref("users/" + userId).update({banned: true})
        .then(() => {
            callback("Success");
        })
        .catch(() => {
            callback("Failed");
        });
    });
}

const unbanUser = (userId, callback) => {
    admin.auth().updateUser(userId, {
        disabled: false
    })
    .then(() => {
        admin.database().ref("users/" + userId).update({banned: false})
        .then(() => {
            callback("Success");
        })
        .catch(() => {
            callback("Failed");
        });
    });
}

const verifyUserFromFirebase = (userId) => {
    return admin.auth().getUser(userId);
};

const getUserInfoFromFirebase = (userId) => {
    return admin.database().ref("users/" + userId).once("value");
};