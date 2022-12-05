import React from 'react';

import css from './FlowerSpinner.module.css';

const FlowerSpinner = () => {
    return (
        <div className={css.Loading}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

export default FlowerSpinner;