import React from 'react';
import PropTypes from 'prop-types';

import css from './Backdrop.module.css';

const Backdrop = (props) => {
    return (
        <div className={css.Backdrop} style={{cursor: props.closeHandler ? "pointer" : null}} onClick={props.closeHandler}></div>
    );
};

Backdrop.propTypes = {
    closeHandler: PropTypes.func
};

export default Backdrop;