import React from 'react';
import PropTypes from 'prop-types';

import css from './GameHistories.module.css';
import History from './History/History';
import FlowerSpinner from '../../UI/Spinner/BaseSpinners/FlowerSpinner/FlowerSpinner';

const GameHistories = (props) => {
    return (
        <div className={css.GameHistories}>
            {props.fetchingGameHistories
            ? (
                <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <FlowerSpinner />
                </div>
            )
            : props.gameHistories && props.gameHistories.length > 0
                ? props.gameHistories.map((history, i) => {
                    return <History key={i} date={history.date} placement={history.placement} category={history.category} />
                })
                : <h2 style={{textAlign: "center", fontSize: "36px"}}>Go play some games!</h2>
            }
        </div>
    );
};

GameHistories.propTypes = {
    fetchingGameHistories: PropTypes.bool,
    gameHistories: PropTypes.arrayOf(PropTypes.object)
}

export default React.memo(GameHistories);