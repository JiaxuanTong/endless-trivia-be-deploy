let Lobby = require("../classes/lobby")
let LobbyUser = require("../classes/lobbyUser.js");
const { JOIN_LOBBY } = require("../constants/socketEvents.js");
const socketEvents = require("../constants/socketEvents.js");

//Everything here is for the navigation page
// All sockets should have some functionality to the navigation page of the user
module.exports = {
  handleNav: (client, io, lobbyList) => {
    //
    // On initial load of navigation page, you should emit to enteredNav to retrieve current list of lobbies
    // Lobby list will come to you in the form of: list[i]: {lobbyID:XXX lobbyName: XXX, lobbyCategory: XXX, state:XXX, #ofUsers: XXX}
    client.on(socketEvents.ENTERED_NAV, function (data, callback) {
      let list = [];
      for(i in lobbyList) {
        if(lobbyList[i].state === "public" && lobbyList[i].availability === "not started") list.push(lobbyList[i]);
      }
      callback(list);
      // if(lobbyList.length === 0)
      // {
      //   io.in('Nav').emit("empty");
      //   callback(lobbyList);
      // }
      // else
      // {
      //   emittedLobbyList = createEmitList(lobbyList);
      //   callback(emittedLobbyList);
      // }

    });

    // I need  to recieve an object like this: object{userID: XXXX, username: XXXX, lobbyName: XXX, lobbyCategory: XXX, state:XXX}, it should be JSONifyed, this is for Minji
    // I will SEND  you a full list of items like this:  list[0]: {id: XXX, name:XXX,state:XXX,category:XXX,userConnected:XXX}, it will be JSONifyed, , this is for Minji
    // I will also SEND a lobbyID: XXX, this is for Frankie and lobby functionality
    client.on(socketEvents.CREATE_LOBBY, function (data,callback) {

      //parsing JSON into seperate variables
      let ids = JSON.parse(data);
      let userId = ids.userid;
      let username = ids.username;
      let lobbyname = ids.lobbyname;
      let lobbyCat = ids.lobbycategory;
      let state = ids.state;
      // Creating a brand new user object, setting host to true
      let user = new LobbyUser(userId, username);
      user.host = true;

      //Creating a brand new lobby object using lobbyUser object and pushing it to the list
      let lobby = new Lobby(user);
      lobby = setLobby(lobby,lobbyname,lobbyCat,state);
      lobbyList.push(lobby);
      callback(lobby.id);
    });

    // I need  to RECIEVE an object like this: object { lobbyID: XXXX, userID: XXXX, username: XXX } Jsonified if its no trouble, this is for Minji
    // I will SEND a single lobbyID that should be saved globally: lobbyID: XXXX , This is for Frankie
    client.on(socketEvents.JOIN_LOBBY, function (data,callback) {
      // Breaking down JSONIFYED object
      let ids = JSON.parse(data);
      lobbyId = ids.lobbyid;
      userId = ids.userid;
      name = ids.username;

      //Getting specific lobby, creating new user object and pushing new user into it
      i = getLobby(lobbyId, lobbyList);
      if(i == -1)
      {
        callback("fail");
      }
      else
      {
        lobbyList[i].addUser(new LobbyUser(userId, name));
        callback(lobbyId);
        client.to(lobbyId).emit(socketEvents.UPDATE_LOBBY, lobbyList[i]);
      }
    });

    client.on(socketEvents.EXIT_LOBBY, function (data) {
      let ids = JSON.parse(data);
      lobbyId = ids.lobbyid;
      userId = ids.userid;

      client.leave(lobbyId);

      const i = lobbyList.findIndex(l => l.id === lobbyId);
      if(i >= 0) {
        lobbyList[i].removeUser(userId);
        if(lobbyList[i].userList.length == 0) {
          lobbyList.splice(i, 1);
        }
        else {
          lobbyList[i].userList[0].host = true;
          io.to(lobbyId).emit(socketEvents.UPDATE_LOBBY, lobbyList[i]);
        }
      }     
    });
  }
};

  //helper function for Minji's lists, meant to get all necessary attributes and send them to client side as a json list
  // const createEmitList = (lobbyList) => {
  //   emittedLobbyList = []
  //   for (let i = 0; i < lobbyList.length; i++) {
  //     if(lobbyList[i].state === "public")
  //       emittedLobbyList.push({ id: lobbyList[i].id, name: lobbyList[i].name, state: lobbyList[i].state, category: lobbyList[i].category, userConnected: lobbyList[i].userList.length });
  //   }
  //   let jsonList = JSON.stringify(emittedLobbyList);
  //   return jsonList;
  // }

  //helper function for locating the correct entry in the lobbyList[]
  const getLobby = (id, list) => {
    for (i in list) {
      if (list[i].id === id) {
        if(list[i].userList.length == 6 || list[i].availability === "started") return -1;
        else return i;
      }
    }
    return -1;
  }

  const setLobby = (lobby, lobbyname ,lobbyCat, state) => {
    lobby.name = lobbyname;
    lobby.category = lobbyCat;
    lobby.state = state;
    return lobby;
  }
