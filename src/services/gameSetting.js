let Lobby = require("../classes/lobby.js");
let LobbyUser = require("../classes/lobbyUser.js");
const socketEvents = require("../constants/socketEvents.js");

module.exports = {
    handleSetting: (client, io, lobbyList) => {
        //each individual lobby has a user list

        client.on(socketEvents.GAME_SETTING,function(data) {
            let changes = JSON.parse(data);
            let lobbyId =changes.lobbyId;
            //lobbyId = '123';
            let changedName= changes.changedName;
            let changedCategory= changes.changedCategory;
            let changedPrivacy=changes.changedPrivacy;
            let lobby ;
            for(let i = 0; i < lobbyList.length; i++){
                if(lobbyList[i].id === lobbyId){
                    lobby = lobbyList[i];
                    lobbyList[i].name = changedName;
                    lobbyList[i].category = changedCategory;
                    lobbyList[i].state = changedPrivacy;
                }
            }
            //HERE IMPLEMENT EMIT THE NEW DATA TO THE PLAYER IN THE PARTICULAR ROOM
            io.to(changes.lobbyId).emit("updateLobby",lobby);
        });



    }
}