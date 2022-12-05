import React from 'react';
import PropTypes from 'prop-types';

import css from './Result.module.css';

const getPlacementContent = (placement) => {
    if (placement === -1 || placement === "-1") {
        return <i className="fas fa-running" style={{color: "#000000"}}></i>;
    }
    else if (placement === 1 || placement === "1") {
        return <i className="fas fa-crown" style={{color: "#e6c300"}}></i>;
    }
    else if (placement === 2 || placement === "2") {
        return <i className="fas fa-crown" style={{color: "#c0c0c0"}}></i>;
    }
    else if (placement === 3 || placement === "3") {
        return <i className="fas fa-crown" style={{color: "#8b4513"}}></i>;
    }
    else if (placement === 4 || placement === "4") {
        return <span style={{color: "#b300b3"}}>{placement + "th"}</span>;
    }
    else if (placement === 5 || placement === "5") {
        return <span style={{color: "#009900"}}>{placement + "th"}</span>;
    }
    else if (placement === 6 || placement === "6") {
        return <span style={{color: "#cf3333"}}>{placement + "th"}</span>;
    }
    else {
        return <span>{placement + "th"}</span>;
    }
};

const Result = (props) => {
    const displayNameCss = [css.DisplayName];
    const indicatorCss = [css.Indicator];
    if (props.isYou) {
        displayNameCss.push(css.You);
        indicatorCss.push(css.You);
    }

    return (
        <div className={css.Result}>
            <div className={css.Placement}>
                {getPlacementContent(props.placement)}
            </div>
            <div className={displayNameCss.join(" ")}>
                {props.displayName}
            </div>
            <div className={indicatorCss.join(" ")}>
                {props.isYou ? <i className="fas fa-hand-point-left"></i> : null}
            </div>
        </div>
    )
};

Result.propTypes = {
    placement: PropTypes.number.isRequired,
    displayName: PropTypes.string.isRequired,
    isYou: PropTypes.bool
};

export default Result;