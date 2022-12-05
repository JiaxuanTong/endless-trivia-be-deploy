import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import css from './PlayerList.module.css';
import Player from './Player/Player.js';

const getFirstSecondAndThirdPoints = (players) => {
    let points = Object.keys(_.cloneDeep(players)).map(id => players[id].point);
    points = points.filter((value, index, array) => array.indexOf(value) === index);
    points.sort((a, b) => b - a);

    return [points[0], points[1], points[2]];
}

const PlayerList = (props) => {
    const [first, second, third] = getFirstSecondAndThirdPoints(props.players);

    return (
        <div className={css.Container}>
            {Object.keys(props.players).map(id => {
                return <Player
                    key={id}
                    displayName={props.players[id].displayName}
                    point={props.players[id].point}
                    placement={props.players[id].point === first ? 1 : props.players[id].point === second ? 2 : props.players[id].point === third ? 3 : null}
                    isYou={props.playerOwnId === id} />
            })}
        </div>
    );
};

PlayerList.propTypes = {
    players: PropTypes.object.isRequired,
    playerOwnId: PropTypes.string.isRequired
};

export default PlayerList;