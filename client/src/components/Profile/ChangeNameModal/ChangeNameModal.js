import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton, Icon } from '@material-ui/core';

import css from './ChangeNameModal.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';

const ChangeNameModal = (props) => {
    return (
        <Fragment>
            <div className={css.ChangeNameModal}>
                <div className={css.Input}>
                    <TextField
                        id="new-nickname"
                        label="New Nickname"
                        placeholder="New Nickname"
                        value={props.newDisplayName}
                        onChange={props.displayNameChangedHandler} />
                </div>
                <div className={css.Buttons}>
                    <IconButton color="secondary" onClick={props.cancelNameChangingHandler}>
                        <Icon className="fa fa-times-circle" />
                    </IconButton>
                    <IconButton color="primary" onClick={props.changeNameHandler}>
                        <Icon className="fa fa-check-circle" />
                    </IconButton>
                </div>
            </div>
            <Backdrop />
        </Fragment>
    );
};

ChangeNameModal.propTypes = {
    changeNameHandler: PropTypes.func.isRequired,
    cancelNameChangingHandler: PropTypes.func.isRequired,
    newDisplayName: PropTypes.string,
    displayNameChangedHandler: PropTypes.func.isRequired
};

export default ChangeNameModal;