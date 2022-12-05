import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

import * as actions from '../../../store/actions/actions';
import * as socketEvents from '../../../constants/socketEvents';
import css from './ProfilePage.module.css';
import BorderedButton from '../../../components/UI/Button/BorderedButton/BorderedButton.js';
import UserProfile from '../../../components/Profile/UserProfile/UserProfile.js';
import GameHistories from '../../../components/Profile/GameHistories/GameHistories.js';
import ChangeNameModal from '../../../components/Profile/ChangeNameModal/ChangeNameModal.js';
import ChangePasswordModal from '../../../components/Profile/ChangePasswordModal/ChangePasswordModal.js';

class ProfilePage extends Component {
    state = {
        changingName: false,
        newDisplayName: "",
        changingPassword: false,
        password: {
            value: "",
            error: false
        },
        confirmPassword: {
            value: "",
            error: false
        },
        changePasswordError: null,
        fetchingStats: true,
        totalGames: 0,
        totalWins: 0,
        totalQuestionsAnswered: 0,
        totalCorrectQuestions: 0,
        fetchingGameHistories: true,
        gameHistories: []
    }

    getUserStatsFromFirebase = () => {
        // Retrieve the user statistics from Firebase
        this.props.firebase.getDatabase().ref("users/" + this.props.userId + "/stats").once("value")
        .then(snapshot => {
            const userStats = snapshot.val();
            if (userStats) {
                this.setState({
                    totalGames: userStats.total_games ? userStats.total_games : 0,
                    totalWins: userStats.total_wins ? userStats.total_wins : 0,
                    totalQuestionsAnswered: userStats.total_questions_answered ? userStats.total_questions_answered : 0,
                    totalCorrectQuestions: userStats.total_correct_questions ? userStats.total_correct_questions : 0
                });
            }
        })
        .finally(() => {
            this.setState({fetchingStats: false});
        });
    }

    getGameHistoriesFromFirebase = () => {
        // Retrieve the game histories from Firebase
        this.props.firebase.getDatabase().ref("users/" + this.props.userId + "/histories").once("value")
        .then(snapshot => {
            const gameHistories = snapshot.val();
            if (gameHistories) {
                this.setState({
                    gameHistories: gameHistories.filter(history => history != null)
                });
            }
        })
        .finally(() => {
            this.setState({fetchingGameHistories: false});
        });
    }

    componentDidMount() {
        this.getUserStatsFromFirebase();
        this.getGameHistoriesFromFirebase();
    }

    startNameChangingHandler = () => {
        this.setState({changingName: true, newDisplayName: ""});
    }

    cancelNameChangingHandler = () => {
        this.setState({changingName: false, newDisplayName: ""});
    }

    displayNameChangedHandler = (event) => {
        this.setState({newDisplayName: event.target.value});
    }

    changeNameHandler = (newDisplayName) => {
        if (this.state.newDisplayName && this.state.newDisplayName.length > 0) {
            // Update the display name in Firebase
            this.props.firebase.getDatabase().ref("users").child(this.props.userId).update({
                display_name: newDisplayName
            })
            .then(() => {
                // Change the display name in redux
                this.props.onDisplayNameChanged(newDisplayName);
                // Change the display name in the server
                this.props.socket.getSocket().emit(socketEvents.PLAYER_DISPLAY_NAME_CHANGED, {
                    newDisplayName: newDisplayName
                });
            })
            .finally(() => {
                this.setState({changingName: false});
            });
        }
        else {
            this.setState({changingName: false});
        }
    }

    startPasswordChangingHandler = () => {
        this.setState({
            changingPassword: true,
            password: {
                value: "",
                error: false
            },
            confirmPassword: {
                value: "",
                error: false
            },
            changePasswordError: null
        });
    }

    endPasswordChangingHandler = () => {
        this.setState({
            changingPassword: false,
            password: {
                value: "",
                error: false
            },
            confirmPassword: {
                value: "",
                error: false
            },
            changePasswordError: null
        });
    }

    passwordChangedHandler = (event) => {
        const password = _.cloneDeep(this.state.password);
        password.value = event.target.value;

        this.setState({password: password});
    }

    confirmPasswordChangedHandler = (event) => {
        const confirmPassword = _.cloneDeep(this.state.confirmPassword);
        confirmPassword.value = event.target.value;
        
        this.setState({confirmPassword: confirmPassword});
    }

    changePasswordHandler = () => {
        if (!this.state.password.value && !this.state.confirmPassword.value) {
            this.endPasswordChangingHandler();
        }
        else if (this.state.password.value === this.state.confirmPassword.value) {
            this.props.firebase.getAuth().currentUser.updatePassword(this.state.password.value)
            .then(() => this.endPasswordChangingHandler())
            .catch(error => {
                const password = _.cloneDeep(this.state.password);
                password.error = true;
                const confirmPassword = _.cloneDeep(this.state.confirmPassword);
                confirmPassword.error = true;

                this.setState({password: password, confirmPassword: confirmPassword, changePasswordError: error.message});
            });
        }
        else {
            const password = _.cloneDeep(this.state.password);
            password.error = true;
            const confirmPassword = _.cloneDeep(this.state.confirmPassword);
            confirmPassword.error = true;

            this.setState({password: password, confirmPassword: confirmPassword, changePasswordError: "Passwords are not matched"});
        }
    }

    render() {
        return (
            <div className={css.ProfilePage}>
                <div className={css.NavigationContainer}>
                    <div className={css.Clear}></div>
                    <BorderedButton color="#ff5959" clickedHandler={this.props.goBackHandler}>Go Back</BorderedButton>
                </div>
                <div className={css.PageContainer}>
                    <div className={css.ProfileContainer}>
                        <div className={css.UserProfile}>
                            <UserProfile
                                displayName={this.props.displayName}
                                fetchingStats={this.state.fetchingStats}
                                totalGames={this.state.totalGames}
                                totalWins={this.state.totalWins}
                                totalQuestionsAnswered={this.state.totalQuestionsAnswered}
                                totalCorrectQuestions={this.state.totalCorrectQuestions}
                                startNameChangingHandler={this.startNameChangingHandler}
                                startPasswordChangingHandler={this.startPasswordChangingHandler} />
                        </div>
                        <div className={css.GameHistories}>
                            <GameHistories
                                fetchingGameHistories={this.state.fetchingGameHistories}
                                gameHistories={this.state.gameHistories} />
                        </div>
                    </div>
                </div>
                {this.state.changingName && !this.state.changingPassword
                ? <ChangeNameModal
                    changeNameHandler={() => this.changeNameHandler(this.state.newDisplayName)}
                    cancelNameChangingHandler={this.cancelNameChangingHandler}
                    newDisplayName={this.state.newDisplayName}
                    displayNameChangedHandler={this.displayNameChangedHandler} />
                : null}
                {this.state.changingPassword && !this.state.changingName
                ? <ChangePasswordModal
                    password={this.state.password.value}
                    confirmPassword={this.state.confirmPassword.value}
                    passwordError={this.state.password.error}
                    confirmPasswordError={this.state.confirmPassword.error}
                    passwordChangedHandler={this.passwordChangedHandler}
                    confirmPasswordChangedHandler={this.confirmPasswordChangedHandler}
                    changePasswordHandler={this.changePasswordHandler}
                    endPasswordChangingHandler={this.endPasswordChangingHandler}
                    errorMessage={this.state.changePasswordError} />
                : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.userId,
        displayName: state.user.displayName,
        firebase: state.misc.firebase,
        socket: state.misc.socket
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDisplayNameChanged: (displayName) => dispatch(actions.changeDisplayName(displayName))
    }
}

ProfilePage.propTypes = {
    goBackHandler: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);