let Lobby = require("../classes/lobby.js");
let LobbyUser = require("../classes/lobbyUser.js");
const admin = require('firebase-admin');
const _ = require("lodash");

const socketEvents = require("../constants/socketEvents.js");

const games = {};
let gameLobbyList = [];

module.exports = {
    handleGame: (socket, io, lobbyList) => {
        socket.on(socketEvents.GAME_START, async(data) => {
            const isCreated = await createGame(io, data.lobbyId, data.category);
            if (isCreated) {
                io.to(data.lobbyId).emit(socketEvents.GAME_CREATED, {});
                const i = lobbyList.findIndex(l => l.id === data.lobbyId);
                lobbyList[i].availability = "started";
                gameLobbyList = lobbyList;
            } 
        });

        socket.on(socketEvents.PLAYER_CONNECTED_TO_GAME, (data) => {
            if (checkIfAllPlayersAreConnected(data.lobbyId, data.playerId)) {
                startGame(io, data.lobbyId);
            }
        });

        socket.on(socketEvents.OPTION_SELECTED, (data) => {
            evaluateResult(io, socket, data.lobbyId, data.option);
        });
    },
    handlePlayerDisconnect: (io, disconnectedPlayerId) => {
        io.emit(socketEvents.PLAYER_DISCONNECTED, {userId: disconnectedPlayerId});

        let found = false;
        for (const lobbyId in games) {
            for (const playerId in games[lobbyId].players) {
                if (playerId === disconnectedPlayerId) {
                    found = true;

                    updateGameHistories(playerId, games[lobbyId].category, -1);
                    delete games[lobbyId].players[playerId];

                    // If all players have quitted, delete this game
                    if (Object.keys(games[lobbyId].players).length === 0) {
                        clearTimeout(games[lobbyId].questionTimer);
                        delete games[lobbyId];
                    }
                    break;
                }
            }
            if (found)  break;
        }
    }
};

const checkIfAllPlayersAreConnected = (lobbyId, playerId) => {
    // Make the newly connected player ready, and check if all other players are ready as well
    if (games[lobbyId]) {
        const players = games[lobbyId].players;
        players[playerId].ready = true;

        let allReady = true;
        for (const playerId in players) {
            allReady &= players[playerId].ready;
        }

        return allReady;
    }

    return false;
}

const createGame = async(io, lobbyId, category) => {
    // If such game does not exist, create one
    if (!games[lobbyId]) {
        // Get all connected socket IDs in the current lobby
        const allSocketIdsInLobby = io.sockets.adapter.rooms[lobbyId].sockets;
        const allConnectedSocketIdsInLobby = [];
        for (const socketId in allSocketIdsInLobby) {
            if (allSocketIdsInLobby[socketId]) {
                allConnectedSocketIdsInLobby.push(socketId);
            }
        }

        // For each game started, get all players in the room, retrieve 10 random questions from given category and store them into the "games" array
        const players = parsePlayers(allConnectedSocketIdsInLobby, io.sockets.clients().connected);
        const questions = await retrieveQuestions(category);
        games[lobbyId] = {
            category: questions[0].category,
            players: players,
            questions: questions,
            questionCount: 0,
            questionTimer: null
        };

        return true;
    }

    return false;
};

const startGame = (io, lobbyId) => {
    // Start the game if exists
    if (games[lobbyId]) {
        const players = games[lobbyId].players;
        const questions = games[lobbyId].questions;
        
        const sentPlayers = {};
        for (const playerId in players) {
            sentPlayers[playerId] = {
                displayName: players[playerId].displayName,
                point: players[playerId].point
            }
        }

        io.to(lobbyId).emit(socketEvents.GAME_READY, {players: sentPlayers, totalQuestions: questions.length});
        sendQuestion(io, lobbyId, 5000);
    }
};

const parsePlayers = (socketIdsInLobby, allConnectedSockets) => {
    const players = {};

    for (const socketIdInLobby of socketIdsInLobby) {
        // For each socket that are in the room, grab their user ID, display name, and construct a player object
        const socketInLobby = allConnectedSockets[socketIdInLobby];
        players[socketInLobby.userId] = {
            displayName: socketInLobby.displayName,
            point: 0,
            answered: false,
            ready: false
        };

        updateStats(socketInLobby.userId, 1, 0, 0, 0);
    }

    return players;
};

const retrieveQuestions = async(category) => {
    // Get all questions under certain category
    const snapshot = await admin.database().ref(`questions/${category}`).once("value");
    
    if (snapshot.val()) {
        // Push all questions indices into an array
        const indices = [];
        for (const index in snapshot.val()) {
            indices.push(parseInt(index));
        }

        // Shuffle the indices and get the first 10 questions
        const responses = [];
        const shuffledIndex = shuffle(indices);
        for (let i = 0; i < 10 && Object.keys(snapshot.val()).length; i++) {
            const questionIndex = shuffledIndex.next().value;
            responses[i] = await admin.database().ref(`questions/${category}/${questionIndex}`).once("value");
        }

        // Construct question object
        const questions = [];
        for (const response of responses) {
            if (response.val()) {
                questions.push(response.val());
            }
        }

        return questions;
    }
    else {
        return [{
            category: "Feedback",
            question: "Error while retriving questions, what about giving us a feedback, what do you think of this game?",
            correct_answer: "Great",
            incorrect_answers: {
                0: "Boring",
                1: "Bad"
            },
            type: "multiple",
            difficulty: "easy"
        }];
    }
};

const sendQuestion = (io, lobbyId, time) => {
    // Send the question after the given time
    setTimeout(() => {
        if (games[lobbyId]) {
            const players = games[lobbyId].players;
            for (const playerId in players) {
                players[playerId].answered = false;
            }
    
            const question = getNextQuestion(lobbyId);
            // If there is more question
            if (question && question !== "END") {
                for (const playerId in players) {
                    updateStats(playerId, 0, 0, 1, 0);
                }
                io.to(lobbyId).emit(socketEvents.NEW_QUESTION, {question: question});
    
                games[lobbyId].questionTimer = setTimeout(() => {
                    const questions = games[lobbyId].questions;
                    const question = questions[games[lobbyId].questionCount++];
        
                    sendResult(io, lobbyId, null, question.correct_answer);
                }, 30000);
            }
            // If there is no more question
            else if (question === "END") {
                handleGameOver(io, lobbyId, players);
            }
        }
    }, time);
};

const getNextQuestion = (lobbyId) => {
    if (games[lobbyId]) {
        // Get the next question from the pool
        const questions = games[lobbyId].questions;
        const questionCount = games[lobbyId].questionCount;

        // If there is no more question, return "END" as identifier
        if (questionCount === 10 || questionCount >= questions.length) {
            return "END";
        }
        // Else return the next available question
        else {
            const question = questions[questionCount];
            const options = [question.correct_answer];
            for (const index in question.incorrect_answers) {
                options.push(question.incorrect_answers[index]);
            }

            return {
                question: question.question,
                options: shuffleOptions(options)
            };
        }
    }
    else {
        return null;
    }
};

const shuffleOptions = (options) => {
    // Shuffle options
    const optionIndices = [];
    for (const optionIndex in options) {
        optionIndices.push(parseInt(optionIndex));
    }

    const shuffledIndex = shuffle(optionIndices);
    const shuffledOptions = [];
    for (let i = 0; i < options.length; i++) {
        const index = shuffledIndex.next().value;
        shuffledOptions.push(options[index]);
    }

    return shuffledOptions;
};

const evaluateResult = (io, socket, lobbyId, option) => {
    if (games[lobbyId]) {
        const questions = games[lobbyId].questions;
        const question = questions[games[lobbyId].questionCount];

        // Evaluate the result sent by player
        const userId = socket.userId;
        const players = games[lobbyId].players;
        if (players[userId] && !players[userId].answered) {
            if (question && question.correct_answer === option) {
                clearTimeout(games[lobbyId].questionTimer);
                games[lobbyId].questionCount++;
    
                players[userId].point++;
                players[userId].answered = true;

                updateStats(userId, 0, 0, 0, 1);
                sendResult(io, lobbyId, userId, question.correct_answer);
            }
            else {
                players[userId].answered = true;
    
                // Check if all players have answered
                checkIfAllAnswered(io, lobbyId, question.correct_answer);
            }
        }
    }
};

const checkIfAllAnswered = (io, lobbyId, correctOption) => {
    if (games[lobbyId]) {
        // Check if all players have answered
        let allAnswered = true;
        const players = games[lobbyId].players;
        for (const playerId in players) {
            allAnswered &= players[playerId].answered;
        }

        // If all players have answered, send the result
        if (allAnswered) {
            games[lobbyId].questionCount++;
            clearTimeout(games[lobbyId].questionTimer);
            sendResult(io, lobbyId, null, correctOption);
        }
    }
};

const sendResult = (io, lobbyId, playerId, correctOption) => {
    // Send result to the players for this question
    io.to(lobbyId).emit(socketEvents.POINT_GRANTED, {
        playerId: playerId,
        correctOption: correctOption
    });

    // After 5 seconds, send the next question
    sendQuestion(io, lobbyId, 5000);
};

const handleGameOver = (io, lobbyId, players) => {
    sendGameFinishMessage(io, lobbyId, players);

    const placements = getPlayerPlacements(players);
    for (const playerId in placements) {
        updateGameHistories(playerId, games[lobbyId].category, placements[playerId]);
    }

    delete games[lobbyId];
    const i = gameLobbyList.findIndex(l => l.id === lobbyId);
    gameLobbyList[i].availability = "not started";
    for(let j = 0; j<gameLobbyList[i].userList.length;j++){
        gameLobbyList[i].userList[j].ready = false;
    }
    io.to(lobbyId).emit(socketEvents.UPDATE_LOBBY, gameLobbyList[i]);
}

const sendGameFinishMessage = (io, lobbyId, players) => {
    // Send game finished message to the clients with the final ranking
    const sentPlayers = {};
    for (const playerId in players) {
        sentPlayers[playerId] = {
            displayName: players[playerId].displayName,
            point: players[playerId].point
        }
    }

    io.to(lobbyId).emit(socketEvents.GAME_OVER, {players: sentPlayers});
};

const getPlayerPlacements = (players) => {
    let points = Object.keys(_.cloneDeep(players)).map(id => players[id].point);
    points = points.filter((value, index, array) => array.indexOf(value) === index);
    points.sort((a, b) => b - a);

    const placements = {};
    for (const playerId in players) {
        for (const index in points) {
            if (points[index] === players[playerId].point) {
                placements[playerId] = parseInt(index) + 1;
                break;
            }
        }
    }

    return placements;
}

const updateStats = async(userId, totalGamesToAdd, totalWinsToAdd, totalQuestionsToAdd, totalCorrectToAdd) => {
    const snapshot = await admin.database().ref(`users/${userId}`).once("value");
    if (snapshot) {
        // Retrieve player's current stats
        const user = snapshot.val();
        let stats = {};
        if (user.stats) {
            stats = {
                totalGames: user.stats.total_games,
                totalWins: user.stats.total_wins,
                totalQuestionsAnswered: user.stats.total_questions_answered,
                totalCorrectQuestions: user.stats.total_correct_questions
            }
        }
        else {
            stats = {
                totalGames: 0,
                totalWins: 0,
                totalQuestionsAnswered: 0,
                totalCorrectQuestions: 0
            }
        }

        // Update the stats
        await admin.database().ref(`users/${userId}/stats`).set({
            total_games: stats.totalGames + totalGamesToAdd,
            total_wins: stats.totalWins + totalWinsToAdd,
            total_questions_answered: stats.totalQuestionsAnswered + totalQuestionsToAdd,
            total_correct_questions: stats.totalCorrectQuestions + totalCorrectToAdd
        });
    }
};

const updateGameHistories = async(userId, category, placement) => {
    // If the placement is 1st, update the player's stats as well
    if (placement === 1) {
        updateStats(userId, 0, 1, 0, 0);
    }

    const snapshot = await admin.database().ref(`users/${userId}/histories`).once("value");
    if (snapshot) {
        const histories = snapshot.val();
        // Get the last game history index
        let lastIndex = 0;
        for (const historyIndex in histories) {
            lastIndex = parseInt(historyIndex);
        }

        // Add this game to the play history
        await admin.database().ref(`users/${userId}/histories/${++lastIndex}`).set({
            category: category,
            date: reformatTime(new Date()),
            placement: placement
        });
    }
};

const reformatTime = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}/${month}/${day}`;
};

function* shuffle(array) {
    let i = array.length;
    while (i--) {
        yield array.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
    }
};