import React from 'react';
import PropTypes from 'prop-types';

import css from './BorderedButton.module.css';

const BorderedButton = (props) => {
    return (
        <button
            className={css.BorderedButton}
            style={{
                color: props.color ? props.color : "#ffffff",
                borderColor: props.color ? props.color : "#ffffff"
            }}
            onClick={props.clickedHandler}
        >
            {props.children}
        </button>
    );
};

BorderedButton.propTypes = {
    color: PropTypes.string,
    clickedHandler: PropTypes.func.isRequired
};

export default React.memo(BorderedButton);