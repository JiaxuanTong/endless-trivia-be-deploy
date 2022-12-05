import React from 'react';
import PropTypes from 'prop-types';

import css from './LoadingScreen.module.css';
import CircleSpinner from '../UI/Spinner/BaseSpinners/CircleSpinner/CircleSpinner';

const LoadingScreen = (props) => {
    return (
        <div className={css.LoadingScreen}>
            <CircleSpinner>{props.message ? props.message : "Loading..."}</CircleSpinner>
        </div>
    );
};

LoadingScreen.propTypes = {
    message: PropTypes.string
};

export default LoadingScreen;