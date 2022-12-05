import React from 'react';
import PropTypes from 'prop-types';

import css from './GradientButton.module.css';

const GradientButton = (props) => {
    return (
        <button
            className={css.GradientButton}
            style={{
                width: props.width ? props.width : "auto",
                height: props.height ? props.height : "auto",
                backgroundImage: `linear-gradient(
                    to left,
                    ${props.sideColor ? props.sideColor : "#ffffff"},
                    ${props.centerColor ? props.centerColor : "#a7a7a7"},
                    ${props.sideColor ? props.sideColor : "#ffffff"})`
            }}
            onClick={props.clickedHandler}
        >
            {props.children}
        </button>
    );
};

GradientButton.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    sideColor: PropTypes.string,
    centerColor: PropTypes.string,
    clickedHandler: PropTypes.func.isRequired
};

export default React.memo(GradientButton);