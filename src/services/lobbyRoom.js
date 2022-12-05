let Lobby = require("../classes/lobby.js");
let LobbyUser = require("../classes/lobbyUser.js");
const socketEvents = require("../constants/socketEvents.js");

module.exports = {
  handleLobby: (client, io, lobbyList) => {
    //each individual lobby has a user list
    client.on(socketEvents.ENTERED_LOBBY, function(data, callback) {
      let dats = JSON.parse(data);
      const lbyInd = lobbyList.findIndex(lby => lby.id === dats.lobbyid);

      client.join(dats.lobbyid);
      if(lbyInd >= 0) {
        callback(lobbyList[lbyInd]);

        //Update lobby information
        io.to(dats.lobbyid).emit(socketEvents.UPDATE_LOBBY, lobbyList[lbyInd]);
      }
    });

    client.on(socketEvents.PLAYER_READY, function(data) {
      //Code for getting data when user clicks on "ready button"
      let dats = JSON.parse(data);
      const lbyInd = lobbyList.findIndex(lby => lby.id === dats.lobbyid);
      if(lbyInd >= 0) {
        const userInd = lobbyList[lbyInd].userList.findIndex(user => user.id === dats.userid);

        lobbyList[lbyInd].userList[userInd].ready = dats.isready;
        io.to(dats.lobbyid).emit(socketEvents.UPDATE_LOBBY, lobbyList[lbyInd]);       
      }      
    });  

    client.on(socketEvents.UPDATE_LOBBY, (lobbyid) => {
      const lbyInd = lobbyList.findIndex(lby => lby.id === lobbyid);
      if(checkPlayersStatus(lobbyList[lbyInd].userList)) io.to(lobbyid).emit(socketEvents.ALL_PLAYERS_READY, true);
      else io.to(lobbyid).emit(socketEvents.ALL_PLAYERS_READY, false);
    });
  }
}
const checkPlayersStatus = (players) => {
  for(i in players) {
    if(!players[i].ready) return false;
  }
  return true;
};