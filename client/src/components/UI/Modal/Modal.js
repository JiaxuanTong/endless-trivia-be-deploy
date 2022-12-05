import React from 'react';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

const Modal = (props) => {
    return (
        <div
            className={css.Modal}
            style={{
                width: props.width ? props.width : "auto",
                color: props.error ? "#ff2525" : "#ffffff"
            }}
        >
            {props.children}
        </div>
    );
};

Modal.propTypes = {
    error: PropTypes.bool,
    width: PropTypes.string
};

export default Modal;