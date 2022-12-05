import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typography, TextField, IconButton, Icon } from '@material-ui/core';

import css from './ChangePasswordModal.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';

const ChangePasswordModal = (props) => {
    return (
        <Fragment>
            <div className={css.ChangePasswordModal}>
                {props.errorMessage ? <Typography className={css.ErrorMessage} variant="subtitle2">{props.errorMessage}</Typography> : null}
                <div className={css.Input}>
                    <TextField
                        id="new-password"
                        label="New Password"
                        placeholder="New Password"
                        type="password"
                        error={props.passwordError}
                        value={props.password}
                        onChange={props.passwordChangedHandler} />
                </div>
                <div className={css.Input}>
                    <TextField
                        id="confirm-password"
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        type="password"
                        error={props.confirmPasswordError}
                        value={props.confirmPassword}
                        onChange={props.confirmPasswordChangedHandler} />
                </div>
                <div className={css.Buttons}>
                    <IconButton color="secondary" onClick={props.endPasswordChangingHandler}>
                        <Icon className="fa fa-times-circle" />
                    </IconButton>
                    <IconButton color="primary" onClick={props.changePasswordHandler}>
                        <Icon className="fa fa-check-circle" />
                    </IconButton>
                </div>
            </div>
            <Backdrop />
        </Fragment>
    );
};

ChangePasswordModal.propTypes = {
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    passwordError: PropTypes.bool,
    confirmPasswordError: PropTypes.bool,
    passwordChangedHandler: PropTypes.func.isRequired,
    confirmPasswordChangedHandler: PropTypes.func.isRequired,
    changePasswordHandler: PropTypes.func.isRequired,
    endPasswordChangingHandler: PropTypes.func.isRequired,
    errorMessage: PropTypes.string
};

export default ChangePasswordModal;