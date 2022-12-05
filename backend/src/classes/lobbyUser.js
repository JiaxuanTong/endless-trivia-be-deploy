class LobbyUser {
    constructor(userId,nickname) {
      this.id = userId;
      this.name = nickname;
      this.votes = 0;
      this.ready = false;
      this.host = false;
    }
  }

  module.exports = LobbyUser;