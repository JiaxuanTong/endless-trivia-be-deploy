import React from 'react';
import PropTypes from 'prop-types';

import css from './Option.module.css';

const getColors = (order) => {
    switch(order) {
        case 0: return ["#80b3ff", "#0066ff"];
        case 1: return ["#66ff66", "#009900"];
        case 2: return ["#ff99c2", "#ff0066"];
        case 3: return ["#ffd699", "#ff9900"];
        default: return ["#ffd699", "#ff9900"];
    }
};

const Option = (props) => {
    const [background, border] = getColors(props.order);
    const optionCss = [css.OptionContainer];
    if (!props.disable) optionCss.push(css.Enable);
    if (props.selected) optionCss.push(css.Selected);

    return (
        <div
            className={optionCss.join(" ")}
            style={{
                cursor: !props.disable ? "pointer": "not-allowed",
                backgroundColor: background,
                borderColor: border,
                opacity: props.correctOption != null ? props.correctOption === props.children ? "1" : "0.25" : "1"
            }}
            onClick={props.clicked}
        >
            <div className={css.Text}>
                {props.order === 0 ? "A" : props.order === 1 ? "B" : props.order === 2 ? "C" : "D"}
                : {props.children}
            </div>
        </div>
    );
};

Option.propTypes = {
    order: PropTypes.number.isRequired,
    disable: PropTypes.bool.isRequired,
    selected: PropTypes.bool,
    correctOption: PropTypes.string,
    clicked: PropTypes.func.isRequired
};

export default Option;