import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from 'react-modal';
import PropTypes from "prop-types";
import * as socketEvents from "../../../constants/socketEvents";

import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import BorderedButton from "../../../components/UI/Button/BorderedButton/BorderedButton";
import css from './GameLobbyPage.module.css';
import PlayerList from "../../../components/PlayerList/PlayerList";
import GameSetting from "../GameSetting/GameSetting";
import GamePage from "../GamePage/GamePage";
import SettingsIcon from "../../../assets/images/settings.png";
import Chat from '../../../components/Chat/Chat/Chat';

class GameLobbyPage extends Component {
    state = {
        inGameLobby: false,
        inSettings: false,
        inGame: false,
        allReady: false,
        playerReady: false,
        isHost: false,
        lobby: {}
    }

    loadLobby = () => {
        const socket = this.props.socket.getSocket();
        let data = {
            userid: this.props.userId,
            lobbyid: this.props.lobbyId,

        };
        socket.emit(socketEvents.ENTERED_LOBBY, JSON.stringify(data), (lobbyObj) => {
            this.setState({
                inGameLobby: true,
                lobby: lobbyObj
            });
        });
    };

    changePlayerState = (ready) => {
        let data = {
            userid: this.props.userId,
            lobbyid: this.props.lobbyId,
            isready: ready
        };
        this.props.socket.getSocket().emit(socketEvents.PLAYER_READY, JSON.stringify(data));
    };

    startGame = () => {
        let data = {
            lobbyId: this.props.lobbyId,
            category: this.state.lobby.category
        };
        this.props.socket.getSocket().emit(socketEvents.GAME_START, data);
    };

    enterSettings = () => {
        this.setState({
            inSettings: true
        });
    };

    goBackHandler = () => {
        this.setState({
            inSettings: false,
            inGame: false
        });
    };

    componentDidMount() {
        Modal.setAppElement('#root');
        const socket = this.props.socket.getSocket();
        this.loadLobby();
        socket.on(socketEvents.UPDATE_LOBBY, (newLobby) => {
            this.setState({ lobby: newLobby });
            const user = this.state.lobby.userList.find(u => u.id === this.props.userId);
            this.setState({ 
                isHost: user.host,
                playerReady: user.ready
            });
            socket.emit(socketEvents.UPDATE_LOBBY, this.props.lobbyId);
        });
        socket.on(socketEvents.ALL_PLAYERS_READY, (state) => {
            this.setState({ allReady: state });
        });
        socket.on(socketEvents.GAME_CREATED, () => {
            this.setState({ inGame: true });
        });
    }

    componentWillUnmount() {
        this.props.socket.getSocket().removeAllListeners();
    }

    customStyles = {
        content: {
            background:"#353a49",
            borderRadius:'20px',
        }
    };

    render() {
        const gameLobby = (
            <div className={css.gameLobbyFullWrapper}>
                <div className={css.navigationBar}>
                    <BorderedButton color="#ff5959" clickedHandler={this.props.goBackHandler}>
                        Go Back
                    </BorderedButton>
                </div>
                <div className={css.gameLobbyWrapper}>
                    <div className={css.gameLobbyPage}>
                        <div className={css.lobbyInfo}>
                            <div className={css.lobbyName}>
                                {this.state.lobby.name}
                                {this.state.isHost ?
                                    <button className={css.settingsButton} onClick={this.enterSettings}><img src={SettingsIcon} alt="settings" /></button>
                                    : <span />
                                }
                            </div>
                            <div className={css.lobbyInfoContent}>LobbyID: {this.props.lobbyId}</div>
                            <div className={css.lobbyInfoContent}>Type: {this.state.lobby.state}</div>
                            <div className={css.lobbyInfoContent}>Category: {this.state.lobby.category}</div>
                        </div>
                        <div className={css.lobbyButtons}>
                            {!this.state.playerReady ?
                                <button className={css.readyButton} onClick={() => this.changePlayerState(true)}>READY</button>
                                : <button className={css.unreadyButton} onClick={() => this.changePlayerState(false)}>UNREADY</button>
                            }
                            {this.state.allReady && this.state.isHost ?
                                <button className={css.readyButton} onClick={this.startGame}>START</button>
                                : <span />
                            }
                        </div>
                        <div className={css.lobbyPlayers}>
                            <PlayerList userList={this.state.lobby.userList} />
                        </div>

                    </div>
                    <div className={css.chatRoom}>
                        <Chat
                            lobbyName={this.state.lobby.name}
                        />
                    </div>
                </div>
                <Modal
                    isOpen={this.state.inSettings}
                    onRequestClose={this.goBackHandler}
                    contentLabel="Game settings"
                    style={this.customStyles}
                >
                    <GameSetting 
                        lobbyName={this.state.lobby.name} 
                        category={this.state.lobby.category}
                        type={this.state.lobby.state}
                        goBackHandler={this.goBackHandler} 
                    />
                </Modal>
            </div>
        );
        return !this.state.inGameLobby ?
            <LoadingScreen />
            : !this.state.inGame ?
                gameLobby
                : <GamePage category={this.state.lobby.category} goBackHandler={this.goBackHandler} />
    }
}
GameLobbyPage.propTypes = {
    goBackHandler: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        userId: state.user.userId,
        lobbyId: state.lobby.lobbyId,
        firebase: state.misc.firebase,
        socket: state.misc.socket
    };
};

export default connect(mapStateToProps)(GameLobbyPage);
