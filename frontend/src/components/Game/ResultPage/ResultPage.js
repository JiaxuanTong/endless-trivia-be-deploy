import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import css from './ResultPage.module.css';
import BorderedButton from '../../UI/Button/BorderedButton/BorderedButton.js';
import Result from './Result/Result.js';

const sortPlayersByPoint = (players) => {
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

const getPlayerPlacements = (playerRanking) => {
    playerRanking = sortPlayersByPoint(playerRanking);

    let points = Object.keys(_.cloneDeep(playerRanking)).map(id => playerRanking[id].point);
    points = points.filter((value, index, array) => array.indexOf(value) === index);
    points.sort((a, b) => b - a);

    const placements = {};
    for (const playerId in playerRanking) {
        for (const index in points) {
            if (points[index] === playerRanking[playerId].point) {
                placements[playerId] = {
                    placement: parseInt(index) + 1,
                    displayName: playerRanking[playerId].displayName
                };
                break;
            }
        }
    }

    return placements;
};

const transitionStyles = {
    'entering': { opacity: 1 },
    'entered':  { opacity: 1 },
    'exiting':  { opacity: 0 },
    'exited':   { opacity: 0 }
};

const ResultPage = (props) => {
    const playerRanking = getPlayerPlacements(props.playerRanking);

    return (
        <div
            className={css.ResultPage}
            style={{
                ...transitionStyles[props.transitionState]
            }}
        >
            <div className={css.NavigationContainer}>
                <div className={css.Clear}></div>
                <BorderedButton color="#ff5959" clickedHandler={props.goBackHandler}>Go Back</BorderedButton>
            </div>
            <div className={css.PageContainer}>
                <div className={css.ResultContainer}>
                    <div className={css.Category}>
                        <span>{props.category}</span>
                    </div>
                    {Object.keys(playerRanking).map(playerId => {
                        const player = playerRanking[playerId];
                        return <Result
                            key={playerId}
                            placement={player.placement}
                            displayName={player.displayName}
                            isYou={playerId === props.playerOwnId} />;
                    })}
                </div>
            </div>
        </div>
    );
};

ResultPage.propTypes = {
    goBackHandler: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired,
    playerRanking: PropTypes.object.isRequired,
    playerOwnId: PropTypes.string.isRequired,
    transitionState: PropTypes.string
};

export default ResultPage;