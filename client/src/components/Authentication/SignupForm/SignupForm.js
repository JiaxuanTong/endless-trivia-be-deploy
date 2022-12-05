import React from 'react';
import PropTypes from 'prop-types';

import css from './SignupForm.module.css';

const SignupForm = (props) => {
    return (
        <div style={{display: props.show ? "block" : "none"}}>
            <div className={css.Textbox}>
                <i className="fas fa-envelope"></i>
                <input className={css.Input} type="email" placeholder="Email" value={props.email} onChange={props.emailChangedHandler} />
            </div>
            <div className={css.Textbox}>
                <i className="fas fa-signature"></i>
                <input className={css.Input} type="text" placeholder="Nickname (Optional)" value={props.displayName} onChange={props.displayNameChangedHandler} />
            </div>
            <div className={css.Textbox}>
                <i className="fas fa-key"></i>
                <input className={css.Input} type="password" placeholder="Password" value={props.password} onChange={props.passwordChangedHandler} />
            </div>
            <div className={css.Textbox}>
                <i className="fas fa-check"></i>
                <input className={css.Input} type="password" placeholder="Confirm Password" value={props.confirmPassword} onChange={props.confirmPasswordChangedHandler} />
            </div>
            <button className={css.Button} onClick={props.signupHandler}>Sign Up</button>
        </div>
    );
};

SignupForm.propTypes = {
    show: PropTypes.bool,
    email: PropTypes.string,
    displayName: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    emailChangedHandler: PropTypes.func.isRequired,
    displayNameChangedHandler: PropTypes.func.isRequired,
    passwordChangedHandler: PropTypes.func.isRequired,
    confirmPasswordChangedHandler: PropTypes.func.isRequired,
    signupHandler: PropTypes.func.isRequired
};

export default SignupForm;