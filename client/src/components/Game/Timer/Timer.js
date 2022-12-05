import React from 'react';
import PropTypes from 'prop-types';

import css from './Timer.module.css';

const getColor = (time) => {
    switch(time) {
        case(10): return "#170000";
        case(9): return "#2e0000";
        case(8): return "#450000";
        case(7): return "#5c0000";
        case(6): return "#730000";
        case(5): return "#8a0000";
        case(4): return "#a10000";
        case(3): return "#b80000";
        case(2): return "#cf0000";
        case(1): return "#e60000";
        case(0): return "#ff0000";
        default: return "#000000";
    }
};

const Timer = (props) => {
    const color = getColor(props.time);
    const timerCss = [css.Timer];
    if (props.time === 5)   timerCss.push(css.Blink);

    return (
        <div className={timerCss.join(" ")} style={{color: color}}>
            {props.time}
        </div>
    );
};

Timer.propTypes = {
    time:PropTypes.number.isRequired
};

export default Timer;