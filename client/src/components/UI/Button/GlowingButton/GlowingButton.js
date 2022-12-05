import React from 'react';
import PropTypes from 'prop-types';

import css from './GlowingButton.module.css';

const GlowingButton = (props) => {
    return (
        <button
            className={css.GlowingButton}
            style={{
                width: props.width ? props.width : "auto",
                height: props.height ? props.height : "auto",
            }}
            onClick={props.clickedHandler}
        >
            {props.children}
        </button>
    );
};

GlowingButton.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    clickedHandler: PropTypes.func.isRequired
};

export default React.memo(GlowingButton);
