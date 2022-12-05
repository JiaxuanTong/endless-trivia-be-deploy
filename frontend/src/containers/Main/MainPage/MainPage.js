import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/actions';
import * as socketEvents from '../../../constants/socketEvents';
import css from './MainPage.module.css';
import Socket from '../../../classes/Socket';
import LoadingScreen from '../../../components/LoadingScreen/LoadingScreen';
import BorderedButton from '../../../components/UI/Button/BorderedButton/BorderedButton';
import GlowingButton from '../../../components/UI/Button/GlowingButton/GlowingButton';
import GlitchedTitle from '../../../components/UI/Title/GlitchedTitle/GlitchedTitle';
import AdminPage from '../AdminPage/AdminPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import LobbyListPage from '../LobbyListPage/LobbyListPage';

class MainPage extends Component {
    state = {
        connected: false,
        inAdminPage: false,
        inProfile: false,
        inLobby: false
    }

    logoutHandler = () => {
        this.props.onSocketDisconnected();
        this.props.onLogOut();
    }

    navigateToAdminPageHandler = () => {
        this.setState({
            inAdminPage: true,
            inProfile: false,
            inLobby: false
        });
    }

    navigateToProfilePageHandler = () => {
        this.setState({
            inAdminPage: false,
            inProfile: true,
            inLobby: false
        });
    }

    playingHandler = () => {
        this.setState({
            inAdminPage: false,
            inProfile: false,
            inLobby: true
        });
    }

    backToMainPageHandler = () => {
        this.setState({
            inAdminPage: false,
            inProfile: false,
            inLobby: false
        });
    }

    handleServerShutdown = (socket) => {
        socket.getSocket().on(socketEvents.SERVER_SHUTDOWN, () => {
            socket.getSocket().disconnect();
            this.logoutHandler();
        });
    }

    connectToSocket = () => {
        // Connect to socket and store it in the redux
        const socket = new Socket();
        this.props.onSocketConnected(socket);

        // Send login event with user data to the backend
        socket.getSocket().emit(socketEvents.PLAYER_LOGGED_IN, {
            userId: this.props.userId,
            email: this.props.email,
            displayName: this.props.displayName,
            role: this.props.role
        }, (response) => {
            if ("Success" === response) {
                this.setState({connected: true});
            }
            else {
                socket.getSocket().disconnect();
                this.logoutHandler();
            }
        });

        this.handleServerShutdown(socket);
    }

    componentDidMount() {
        this.connectToSocket();
    }

    render() {
        const mainPage = (
            <div className={css.MainPage}>
                <div className={css.NavigationContainer}>
                    {this.props.role && "ADMIN" === this.props.role.toUpperCase()
                    ? (
                        <Fragment>
                            <div className={css.Clear}></div>
                            <BorderedButton color="#ffee59" clickedHandler={this.navigateToAdminPageHandler}>Admin Page</BorderedButton>
                        </Fragment>
                    )
                    : null}
                    <div className={css.Clear}></div>
                    <BorderedButton color="#5983ff" clickedHandler={this.navigateToProfilePageHandler}>My Profile</BorderedButton>
                    <div className={css.Clear}></div>
                    <BorderedButton color="#ff5959" clickedHandler={this.logoutHandler}>Log Out</BorderedButton>
                </div>
                <div className={css.TitleContainer}>
                    <GlitchedTitle data-text="ENDLESS TRIVIA">ENDLESS TRIVIA</GlitchedTitle>
                </div>
                <div className={css.PlayButtonContainer}>
                    <h2 className={css.WelcomeMessage}>Hi, <span className={css.DisplayName}>{this.props.displayName}</span></h2>
                    <GlowingButton width="200px" clickedHandler={this.playingHandler}>Play</GlowingButton>
                </div>
            </div>
        );

        return !this.state.connected
        ? <LoadingScreen />
        : !this.state.inLobby
            ? !this.state.inAdminPage
                ? !this.state.inProfile
                    ? mainPage
                    : <ProfilePage goBackHandler={this.backToMainPageHandler} />
                : <AdminPage goBackHandler={this.backToMainPageHandler} />
            : <LobbyListPage goBackHandler={this.backToMainPageHandler} />
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.userId,
        email: state.user.email,
        displayName: state.user.displayName,
        role: state.user.role,
        socket: state.misc.socket
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSocketConnected: (socket) => dispatch(actions.socketConnected(socket)),
        onSocketDisconnected: () => dispatch(actions.socketDisconnected()),
        onLogOut: () => dispatch(actions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);