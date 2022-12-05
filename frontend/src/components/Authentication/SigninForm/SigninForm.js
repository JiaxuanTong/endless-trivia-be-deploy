import React from 'react';
import PropTypes from 'prop-types';

import css from './SigninForm.module.css';

const SigninForm = (props) => {
    return (
        <div style={{display: props.show ? "block" : "none"}}>
            <div className={css.Textbox}>
                <i className="fas fa-envelope"></i>
                <input className={css.Input} type="email" placeholder="Email" value={props.email} onChange={props.emailChangedHandler} />
            </div>
            <div className={css.Textbox}>
                <i className="fas fa-key"></i>
                <input className={css.Input} type="password" placeholder="Password" value={props.password} onChange={props.passwordChangedHandler} />
            </div>
            <button className={css.Button} onClick={props.signinHandler}>Sign In</button>
        </div>
    );
};

SigninForm.propTypes = {
    show: PropTypes.bool,
    email: PropTypes.string,
    password: PropTypes.string,
    emailChangedHandler: PropTypes.func.isRequired,
    passwordChangedHandler: PropTypes.func.isRequired,
    signinHandler: PropTypes.func.isRequired
};

export default SigninForm;