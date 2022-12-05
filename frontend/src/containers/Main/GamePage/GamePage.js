import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

import * as socketEvents from '../../../constants/socketEvents.js';
import css from './GamePage.module.css'
import Spinner from '../../../components/UI/Spinner/Fullscreen/Spinner.js';
import PlayerList from '../../../components/Game/PlayerList/PlayerList.js';
import QuestionBoard from '../../../components/Game/QuestionBoard/QuestionBoard.js';
import ResultPage from '../../../components/Game/ResultPage/ResultPage.js';

class GamePage extends Component {
    state = {
        loading: true,
        players: null,
        question: null,
        totalQuestions: 0,
        questionCount: 0,
        optionSelected: null,
        correctOption: null,
        startTimeLeft: 0,
        startTimer: null,
        questionTimeLeft: 0,
        questionTimer: null,
        gameOver: false,
        playerRanking: null
    }

    setupStartTimer = () => {
        clearInterval(this.state.startTimer);
        this.setState({
            startTimeLeft: 5,
            startTimer: setInterval(() => {
                this.setState((prevState) => {
                    const prevTime = prevState.startTimeLeft;
                    return {startTimeLeft: prevTime >= 1 ? prevTime - 1 : 0};
                });
            }, 1000)
        });
    }

    setupQuestionTimer = () => {
        clearInterval(this.state.questionTimer);
        this.setState({
            questionTimeLeft: 30,
            questionTimer: setInterval(() => {
                this.setState((prevState) => {
                    const prevTime = prevState.questionTimeLeft;
                    return {questionTimeLeft: prevTime >= 1 ? prevTime - 1 : 0};
                });
            }, 1000)
        });
    }

    sortPlayersByPoint = (players) => {
        if (players) {
            const sortable = [];
            for (const playerId in players) {
                sortable.push([playerId, players[playerId].point]);
            }

            sortable.sort((a, b) => b[1] - a[1]);

            const newPlayers = {};
            for (const value of sortable) {
                newPlayers[value[0]] = {
                    displayName: players[value[0]].displayName,
                    point: value[1]
                };
            }

            return newPlayers;
        }

        return players;
    }

    sendReadySignal = () => {
        // Below GAME_START event is just for tesing purpose
        // this.props.socket.getSocket().emit(socketEvents.GAME_START, {
        //     lobbyId: this.props.lobbyId,
        //     category: this.props.category
        // });

        this.props.socket.getSocket().emit(socketEvents.PLAYER_CONNECTED_TO_GAME, {
            lobbyId: this.props.lobbyId,
            playerId: this.props.userId
        });
    }

    listenForGameReady = () => {
        this.props.socket.getSocket().on(socketEvents.GAME_READY, (data) => {
            if (this.state.loading) {
                this.setState({
                    loading: false,
                    players: data.players,
                    totalQuestions: data.totalQuestions
                });
                this.setupStartTimer();
            }
        });
    }

    listenForNewQuestion = () => {
        this.props.socket.getSocket().on(socketEvents.NEW_QUESTION, (data) => {
            clearInterval(this.state.startTimer);
            this.setState((prevState) => {
                return {
                    question: data.question,
                    questionCount: prevState.questionCount + 1,
                    optionSelected: null,
                    correctOption: null,
                    startTimeLeft: null
                };
            });
            this.setupQuestionTimer();
        });
    }

    listenForPointGrant = () => {
        this.props.socket.getSocket().on(socketEvents.POINT_GRANTED, (data) => {
            let players = _.cloneDeep(this.state.players);
            if (data.playerId != null && players[data.playerId] != null) {
                players[data.playerId].point = players[data.playerId].point + 1;
                players = this.sortPlayersByPoint(players);
            }

            clearInterval(this.state.questionTimer);
            this.setState({
                players: players,
                optionSelected: this.state.optionSelected != null ? this.state.optionSelected : -1,
                correctOption: data.correctOption,
                questionTimeLeft: 0
            });
        });
    }

    listenForGameOver = () => {
        this.props.socket.getSocket().on(socketEvents.GAME_OVER, (data) => {
            this.setState({gameOver: true, playerRanking: data.players});
        });
    }

    listenForPlayerDisconnection = () => {
        this.props.socket.getSocket().on(socketEvents.PLAYER_DISCONNECTED, (data) => {
            const players = _.cloneDeep(this.state.players);
            delete players[data.userId];

            this.setState({players: players});
        });
    }

    componentDidMount() {
        this.sendReadySignal();
        this.listenForGameReady();
        this.listenForNewQuestion();
        this.listenForPointGrant();
        this.listenForGameOver();
        this.listenForPlayerDisconnection();
    }

    optionSelectedHandler = (index) => {
        if (this.state.optionSelected == null) {
            this.setState({optionSelected: index});
            this.props.socket.getSocket().emit(socketEvents.OPTION_SELECTED, {
                lobbyId: this.props.lobbyId,
                option: this.state.question.options[index]
            });
        }
    }

    render() {
        return (
            <Fragment>
                {!this.state.gameOver
                ? (
                    <div className={css.GamePage}>
                        {this.state.loading
                        ? <Spinner />
                        : (
                            <div className={css.PageContainer}>
                                <div className={css.GameContainer}>
                                    <div className={css.PlayerListContainer}>
                                        <PlayerList players={this.state.players} playerOwnId={this.props.userId} />
                                    </div>
                                    <div className={css.QuestionContainer}>
                                        <QuestionBoard
                                            startCountdown={this.state.startTimeLeft}
                                            question={this.state.question}
                                            selected={this.state.optionSelected}
                                            correctOption={this.state.correctOption}
                                            timeLeft={this.state.questionTimeLeft}
                                            questionCount={this.state.questionCount} 
                                            totalQuestions={this.state.totalQuestions}
                                            optionSelectedHandler={this.optionSelectedHandler} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
                : null}
                <Transition in={this.state.gameOver} timeout={1000} mountOnEnter unmountOnExit>
                    {state => (
                        <ResultPage
                            goBackHandler={this.props.goBackHandler}
                            category={this.props.category}
                            playerRanking={this.state.playerRanking}
                            playerOwnId={this.props.userId}
                            transitionState={state} />
                    )}
                </Transition>
            </Fragment>
        );
        // return !this.state.gameOver
        // ? (
        //     <div className={css.GamePage}>
        //         {this.state.loading
        //         ? <Spinner />
        //         : (
        //             <div className={css.PageContainer}>
        //                 <div className={css.GameContainer}>
        //                     <div className={css.PlayerListContainer}>
        //                         <PlayerList players={this.state.players} playerOwnId={this.props.userId} />
        //                     </div>
        //                     <div className={css.QuestionContainer}>
        //                         <QuestionBoard
        //                             startCountdown={this.state.startTimeLeft}
        //                             question={this.state.question}
        //                             selected={this.state.optionSelected}
        //                             correctOption={this.state.correctOption}
        //                             timeLeft={this.state.questionTimeLeft}
        //                             questionCount={this.state.questionCount} 
        //                             totalQuestions={this.state.totalQuestions}
        //                             optionSelectedHandler={this.optionSelectedHandler} />
        //                     </div>
        //                 </div>
        //             </div>
        //         )}
        //     </div>
        // )
        // : <ResultPage
        //     goBackHandler={this.props.goBackHandler}
        //     category={this.props.category}
        //     playerRanking={this.state.playerRanking}
        //     playerOwnId={this.props.userId} />;
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.userId,
        lobbyId: state.lobby.lobbyId,
        socket: state.misc.socket
    }
}

GamePage.propTypes = {
    category: PropTypes.string.isRequired,
    goBackHandler: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(GamePage);