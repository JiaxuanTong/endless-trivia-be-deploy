import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';

import * as socketEvents from '../../../../constants/socketEvents.js';
import css from './UserList.module.css';
import FlowerSpinner from '../../../../components/UI/Spinner/BaseSpinners/FlowerSpinner/FlowerSpinner.js';
import User from '../../../../components/Admin/User/User.js';

class UserList extends Component {
    constructor(props) {
        super(props);
        this.topRef = React.createRef();
    }

    state = {
        loading: true,
        users: []
    }

    retrieveUsers = () => {
        this.setState({loading: true});

        this.props.firebase.getDatabase().ref("users").once("value")
        .then(snapshot => {
            const users = snapshot.val();
            if (users) {
                let usersState = [];
                for (const userId in users) {
                    usersState.push({
                        userId: userId,
                        email: users[userId].email,
                        banned: users[userId].banned
                    });
                }

                usersState = usersState.filter(user => user.userId !== this.props.userId);
                this.setState({users: usersState});
            }
        })
        .finally(() => {
            this.setState({loading: false});
        });
    }

    componentDidMount() {
        this.retrieveUsers();
    }

    userClickedHandler = (userId) => {
        this.props.firebase.getDatabase().ref(`users/${userId}`).once("value")
        .then(snapshot => {
            const user = snapshot.val();
            if (user) {
                if (!user.banned) {
                    this.props.socket.getSocket().emit(socketEvents.PLAYER_BANNED, {userId}, (response) => {
                        if (response === "Success") this.retrieveUsers();
                    });
                }
                else {
                    this.props.socket.getSocket().emit(socketEvents.PLAYER_UNBANNED, {userId}, (response) => {
                        if (response === "Success") this.retrieveUsers();
                    });
                }
            }
        });
    }

    scrollToTopHandler = () => {
        this.topRef.current.scrollIntoView({behavior: "smooth"});
    }

    render() {
        return (
            <div className={css.Container}>
                {this.state.loading
                ? (
                    <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <FlowerSpinner />
                    </div>
                )
                : (
                    <div className={css.UserList}>
                        <div ref={this.topRef}></div>
                        {this.state.users.map(user => {
                            return <User
                                key={user.userId}
                                userId={user.userId}
                                email={user.email}
                                banned={user.banned}
                                clickedHandler={this.userClickedHandler} />;
                        })}
                    </div>
                )}
                <IconButton className={css.UpwardButton} onClick={this.scrollToTopHandler} color="primary">
                    <PublishIcon fontSize="inherit" />
                </IconButton>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        userId: state.user.userId,
        firebase: state.misc.firebase,
        socket: state.misc.socket
    }
}

export default connect(mapStateToProps)(UserList);