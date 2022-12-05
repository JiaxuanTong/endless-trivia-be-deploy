import React, { Component } from "react";
import { connect } from "react-redux";
import * as socketEvents from "../../../constants/socketEvents";
import css from './Chat.module.css';
import TopBar from '../TopBar/TopBar';
import Messages from '../Messages/Messages';
import TextInputBox from '../TextInputBox/TextInputBox';

let socket;

class Chat extends Component {
    state = {
        windowSize: "",
        Lobby_ID: -1,
        Messages: [],
        Message: '',
        Lobby_name: '',
        User: { id: -1, name: '', color: '' },
    }

    constructor(props) {
        super(props);
        // console.log('at constructor')
        // console.log(this.props)
        let user = {
            id: this.props.userId,
            name: this.props.displayName,
            color: "828282"
        }
        this.state = {
            Lobby_ID: this.props.lobbyId,
            Messages: [],
            Message: '',
            User: user,
            Lobby_name: props.lobbyName,
        };
        socket = this.props.socket.getSocket();
        let data = {
            lobbyid: this.state.Lobby_ID,
            user: this.state.User
        }
        // console.log('join_Handler');
        socket.emit(socketEvents.JOIN_CHAT_ROOM,
            { data },
            (response) => {
                // console.log('After Join Chat!');
            }
        );
        // console.log('end constructor');
    }

    setMessage = (new_message) => {
        this.setState({ Message: new_message });
    }

    sendMessage = (event) => {
        event.preventDefault();

        if (this.state.Message !== '') {
            const temp_message = this.state.Message.toString();
            socket.emit(socketEvents.SEND_MESSAGE_C,
                { arg_user: this.state.User, arg_lobbyid: this.state.Lobby_ID, arg_message: temp_message },
                () => this.setMessage(''));
            this.setMessage('');
        }
    }

    scrollToBottom = () => {
        var objDiv = document.getElementById("messages_scroll");
        if (objDiv != null){
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }

    on = (e) => {
        // console.log('git clickjfioahjfdiuohsfadiouhudios')
        // console.log(document.body.clientWidth)
        // if (document.body.clientWidth <= 812) {
        e.stopPropagation();
        document.getElementById(css.overlay).style.display = "block";
        document.getElementById(css.chatButton).style.display = "none";
        // }

    }

    off = (e) => {
        if (e.target.id == css.overlay && document.body.clientWidth <= 812) {
            document.getElementById(css.overlay).style.display = "none";
            document.getElementById(css.chatButton).style.display = "block";
        }

    }

    handleResize = e => {

        const newwindowSize = document.body.clientWidth;
        // console.log(newwindowSize);
        this.setState({ windowSize: newwindowSize });
        if (newwindowSize > 812) {
            // console.log('asdfasdfsadf')
            document.getElementById(css.overlay).style.display = "block";
            document.getElementById(css.chatButton).style.display = "none";
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        socket.on(socketEvents.SEND_MESSAGE_S, new_message => {
            // console.log('SEND_MESSAGE_S');
            // console.log('SEND_MESSAGE_S: newmessage:', new_message);
            let old_Messages = [...this.state.Messages];
            old_Messages.push(new_message);
            this.setState({ Messages: old_Messages });
            // window.scrollTo(0, document.querySelector(".messages").scrollHeight);
            this.scrollToBottom();
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
        // this.props.socket.getSocket().removeAllListeners();
    }

    render() {
        return (
            <div className={css.chatWrapper}>
                <button id={css.chatButton} onClick={(e) => this.on(e)}><i className="fas fa-comment fa-3x"></i></button>
                <div id={css.overlay} className={css.chatContainer} onClick={(e) => this.off(e)}>
                    <div className={css.bodyContainer}>
                        <TopBar
                            name={this.state.User.name}
                            lobbyid={this.props.lobbyName}
                            color="blue"
                        />
                        <Messages
                            messages={this.state.Messages}
                            name={this.state.User.name}
                        />
                        <TextInputBox
                            message={this.state.Message}
                            setMessage={this.setMessage}
                            sendMessage={this.sendMessage}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        displayName: state.user.displayName,
        userId: state.user.userId,
        lobbyId: state.lobby.lobbyId,
        firebase: state.misc.firebase,
        socket: state.misc.socket
    };
};

export default connect(mapStateToProps)(Chat);
