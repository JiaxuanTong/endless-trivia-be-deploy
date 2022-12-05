import React, { Fragment } from 'react';

import css from './Spinner.module.css';
import Backdrop from '../../Backdrop/Backdrop';
import FlowerSpinner from '../BaseSpinners/FlowerSpinner/FlowerSpinner';

const Spinner = () => {
    return (
        <Fragment>
            <Backdrop />
            <div className={css.Spinner}>
                <FlowerSpinner />
            </div>
        </Fragment>
    );
};

export default Spinner;