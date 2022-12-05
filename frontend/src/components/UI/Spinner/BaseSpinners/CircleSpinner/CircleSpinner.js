import React from 'react';

import css from './CircleSpinner.module.css';

const CircleSpinner = (props) => {
    return (
        <div className={css.Loading}>
            <span>{props.children}</span>
        </div>
    );
};

export default CircleSpinner;