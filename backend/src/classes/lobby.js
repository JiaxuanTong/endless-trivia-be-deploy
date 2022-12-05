let generateName = require("../utilities/displayNames");
let lobbyUser = require("./lobbyUser.js");

class Lobby {
    constructor(user) {
      this.id = Math.random().toString(36).substr(2, 9);
      this.name = generateName.generateDisplayName;
      this.state = "public";
      this.availability = "not started";
      this.category = "General";
      this.userList = [];
      this.userList.push(user);
    }

    addUser(user) {
      if(this.userList.length < 6) this.userList.push(user);
    }
    removeUser(userId) {
      const i = this.userList.findIndex(u => u.id === userId);
      if (i >= 0) {
        this.userList[i].host = false;
        this.userList.splice(i, 1);
      }
    }
  }

  module.exports = Lobby;