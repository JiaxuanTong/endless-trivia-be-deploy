import React from 'react';
import PropTypes from 'prop-types';

import css from './Player.module.css';

const getColor = (point) => {
    switch(point) {
        case 0: return "#0099ff";
        case 1: return "#1a8aff";
        case 2: return "#337aff";
        case 3: return "#4c6bff";
        case 4: return "#665cff";
        case 5: return "#804cff";
        case 6: return "#993dff";
        case 7: return "#b22eff";
        case 8: return "#cc1fff";
        case 9: return "#e60fff";
        default: return "#ff00ff";
    };
}

const Player = (props) => {
    const nameCss = [css.Name];
    if (props.isYou)    nameCss.push(css.You);

    const pointColor = getColor(props.point);

    return (
        <div className={css.Player}>
            <div className={css.Point} style={{color: pointColor}}>{props.point}</div>
            <div className={css.NameContainer_1}>
                <div className={css.Placement}>
                    {props.placement && props.placement <= 3
                    ? <i className="fas fa-crown" style={{color: props.placement === 1 ? "#e6c300" : props.placement === 2 ? "#c0c0c0" : "#8b4513"}}></i>
                    : null}
                </div>
                <div className={css.NameContainer_2}>
                    <div className={nameCss.join(" ")} title={props.displayName}>{props.displayName}</div>
                    {props.isYou ? <i className="fas fa-hand-point-left"></i> : null}
                </div>
            </div>
        </div>
    );
};

Player.propTypes = {
    displayName: PropTypes.string.isRequired,
    point: PropTypes.number.isRequired,
    placement: PropTypes.number,
    isYou: PropTypes.bool
};

export default Player;