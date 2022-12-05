import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import * as actions from "../../../store/actions/actions";
import * as socketEvents from "../../../constants/socketEvents";
import css from "./LobbyListPage.module.css";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import BorderedButton from "../../../components/UI/Button/BorderedButton/BorderedButton";
import Lobby from "../../../components/Lobby/Lobby";
import GameLobbyPage from "../GameLobbyPage/GameLobbyPage";

class LobbyListPage extends Component {
  state = {
    connected: false,
    inGameLobby: false,
    lobbyCreated: false,
    createLobby: false,
    failedToCreate: false,
    failedToJoin: false,
    id: "",
    lobbyname: "",
    username: "",
    state: "public",
    category: "Computers",
    userConnected: "1",
    lobbyList: [],
    lobbyId: "",
    categoryList: [],
  };

  loadNav = () => {
    this.handleRefresh();
    this.setState({ connected: true });
  };

  handleRefresh = () => {
    this.props.socket.getSocket().emit(socketEvents.ENTERED_NAV, {}, (list) => {
      this.setState({ lobbyList: list });
    });
  };

  createLobby = () => {
    this.setState({
      createLobby: true,
    });
  };

  goBackHandler = () => {
    let data = {
      userid: this.props.userId,
      lobbyid: this.props.lobbyId,
    };
    this.props.socket.getSocket().emit("exitedLobby", JSON.stringify(data));
    this.props.onLobbyLeft();
    this.setState({
      inGameLobby: false,
      id: "",
    });
  };

  createLobbyHandler = () => {
    if (this.state.lobbyname === "") {
      this.setState({
        failedToCreate: true,
      });
    } else {
      let newLobby = {
        userid: this.props.userId,
        username: this.props.displayName,
        lobbyname: this.state.lobbyname,
        lobbycategory: this.state.category,
        state: this.state.state,
      };
      this.props.socket
        .getSocket()
        .emit(socketEvents.CREATE_LOBBY, JSON.stringify(newLobby), (id) => {
          this.props.onLobbyJoined(id);
          this.setState({
            id: id,
            lobbyCreated: true,
            inGameLobby: true,
            createLobby: false,
            failedToCreate: false,
          });
        });
    }
  };

  closeAlert = () => {
    this.setState({
      failedToCreate: false,
    });
  };

  cancelCreate = () => {
    this.setState({
      createLobby: false,
      failedToCreate: false,
    });
  };

  handleRadioChange = (event) => {
    this.setState({
      state: event.target.value,
    });
  };

  handleLabelChange = (event) => {
    this.setState({
      category: event.target.value,
    });
  };

  handleTextFieldChange = (e) => {
    this.setState({
      lobbyname: e.target.value,
    });
  };

  joinLobbyHandler = (id = this.state.id) => {
    let newLobby = {
      //Need userID and lobbyID
      userid: this.props.userId,
      username: this.props.displayName,
      lobbyid: id,
    };
    
    this.props.socket
      .getSocket()
      .emit(socketEvents.JOIN_LOBBY, JSON.stringify(newLobby), (id) => {
        if (id === "fail") {
          this.setState({
            failedToJoin: true,
          });
        } else {
          //this.state.id = id;
          this.props.onLobbyJoined(id);
          this.setState({
            failedToJoin: false,
            inGameLobby: true,
            lobbyId: this.state.id,
          });
        }
      });
  };

  handleLobbyInputChange = (e) => {
    this.setState({
      id: e.target.value,
    });
  };

  closeFailMsg = () => {
    this.setState({
      failedToJoin: false,
    });
  };

  retrieveCategories = () => {
    this.props.firebase
      .getDatabase()
      .ref("questions")
      .once("value")
      .then((snapshot) => {
        const questions = snapshot.val();
        if (questions) {
          let categoryState = [];
          for (const category in questions) {
            categoryState.push({
              category,
            });
          }

          this.setState({categoryList: categoryState});
        }
      });
  };

  componentDidMount() {
    this.retrieveCategories();
    this.loadNav();
  }

  render() {
    const lobbyListPage = (
      <div className={css.LobbyListPage}>
        <div className={css.NavigationContainer}>
          <div className={css.Clear}></div>
          <BorderedButton
            color="#ff5959"
            clickedHandler={this.props.goBackHandler}
          >
            Go Back
          </BorderedButton>
          <div className={css.Clear}></div>
          <BorderedButton color="#5983ff" clickedHandler={this.createLobby}>
            Create Lobby
          </BorderedButton>
          <div className={css.Clear}></div>
          <BorderedButton color="#E8EC10" clickedHandler={this.handleRefresh}>
            Refresh
          </BorderedButton>
          <div className={css.Clear}></div>
          <div className={css.Search}>
            <BorderedButton
              color="#FFB579"
              clickedHandler={() => this.joinLobbyHandler()}
            >
              Join
            </BorderedButton>
            <input
              className={css.searchBox}
              placeholder="Type private room code"
              value={this.state.id}
              onChange={this.handleLobbyInputChange}
            ></input>
          </div>
        </div>
        <Dialog
          open={this.state.createLobby}
          onClose={this.cancelCreate}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create Lobby</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              id="lobbyname"
              label="Room Name"
              type="lobbyname"
              fullWidth
              value={this.state.lobbyname}
              onChange={this.handleTextFieldChange}
            />
            <RadioGroup
              aria-label="state"
              name="state"
              value={this.state.state}
              onChange={this.handleRadioChange}
            >
              <FormControlLabel
                value="public"
                control={<Radio color="primary" />}
                label="public"
              />
              <FormControlLabel
                value="private"
                control={<Radio color="primary" />}
                label="private"
              />
            </RadioGroup>
            <FormControl className={css.formControl}>
              <InputLabel shrink id="category-label">
                Category
              </InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={this.state.category}
                onChange={this.handleLabelChange}
                label={this.state.category}
              >
                {this.state.categoryList.map((category, index) => (
                  <MenuItem key={index} value={category.category}>{category.category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelCreate} color="primary">
              Cancel
            </Button>
            <Button onClick={this.createLobbyHandler} color="primary">
              Create Lobby
            </Button>
          </DialogActions>
          <Dialog open={this.state.failedToCreate} onClose={this.closeAlert}>
            <Alert severity="error">
              <AlertTitle>
                <strong>Error</strong>
              </AlertTitle>
              Please type the room name!
            </Alert>
          </Dialog>
        </Dialog>
        <div className={css.LobbyContainer}>
          <div className={css.LobbyCard}>
            <Lobby
              lobbyList={this.state.lobbyList}
              joinLobbyHandler={this.joinLobbyHandler}
            />
            <Dialog open={this.state.failedToJoin} onClose={this.closeFailMsg}>
              <Alert severity="error">
                <AlertTitle>
                  <strong>Error</strong>
                </AlertTitle>
                Unable to join the selected room —{" "}
                <strong>Please click the refresh button!</strong>
              </Alert>
            </Dialog>
          </div>
        </div>
      </div>
    );

    //return lobbyListPage;
    return !this.state.connected ? (
      <LoadingScreen />
    ) : !this.state.inGameLobby ? (
      lobbyListPage
    ) : (
      <GameLobbyPage
        category={this.state.category}
        goBackHandler={this.goBackHandler}
      />
    );
  }
}

LobbyListPage.propTypes = {
  goBackHandler: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    displayName: state.user.displayName,
    userId: state.user.userId,
    lobbyId: state.lobby.lobbyId,
    firebase: state.misc.firebase,
    socket: state.misc.socket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLobbyJoined: (lobbyId) => dispatch(actions.lobbyJoined(lobbyId)),
    onLobbyLeft: () => dispatch(actions.lobbyLeft()),
  };
};

LobbyListPage.propTypes = {
  goBackHandler: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyListPage);
