import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/actions';
import { generateDisplayName } from '../../utilities/displayNames';
import css from './Authentication.module.css';
import SigninForm from '../../components/Authentication/SigninForm/SigninForm';
import SignupForm from '../../components/Authentication/SignupForm/SignupForm';
import Spinner from '../../components/UI/Spinner/Fullscreen/Spinner';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Modal from '../../components/UI/Modal/Modal';

class Authentication extends Component {
    state = {
        showSignin: true,
        email: "",
        displayName: "",
        password: "",
        confirmPassword: "",
        authenticating: false,
        errorMessage: null
    };

    componentDidMount() {
        this.props.onLogOut();
    }

    switchFormHandler = (form) => {
        // Switch between the sign in & sign up form
        switch (form) {
            case "SIGN IN":
                this.setState({showSignin: true});
                break;
            case "SIGN UP":
                this.setState({showSignin: false});
                break;
            default: this.setState({showSignin: true});
        }
    }

    emailChangedHandler = (event) => {
        this.setState({email: event.target.value});
    }

    displayNameChangedHandler = (event) => {
        this.setState({displayName: event.target.value});
    }

    passwordChangedHandler = (event) => {
        this.setState({password: event.target.value});
    }

    confirmPasswordChangedHandler = (event) => {
        this.setState({confirmPassword: event.target.value});
    }

    getUserInfo = (response) => {
        // Retrieve user role from RealTime Database
        this.props.firebase.getDatabase().ref("users/" + response.user.uid).once("value")
        .then(snapshot => {
            const userData = snapshot.val();
            // Set user states in Redux if signed in successfully
            this.props.onSuccessfullyAuthenticated(response.user.uid, userData.email, userData.display_name, userData.role);
        });
    }

    signIn = () => {
        // Use Firebase Authentication to sign in user
        this.props.firebase.getAuth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(response => {
            this.getUserInfo(response);
        })
        .catch(error => {
            // Display error message if signed in failed
            this.setState({authenticating: false, errorMessage: error.message})
        });
    }

    signinHandler = () => {
        this.setState({authenticating: true, errorMessage: null});
        this.signIn();
    }

    saveUserInfo = (response) => {
        // Generate a random display name for the newly signed up user if user has not provided one
        const displayName = this.state.displayName ? this.state.displayName : generateDisplayName();
        const role = "PLAYER";
        // Save user info in RealTime Database
        this.props.firebase.getDatabase().ref("users/" + response.user.uid).set({
            email: response.user.email,
            display_name: displayName,
            role: role,
            banned: false,
            stats: {
                total_games: 0,
                total_wins: 0,
                total_questions_answered: 0,
                total_correct_questions: 0
            }
        })
        .then(() => {
            // Set states in Redux if all actions were successful
            this.props.onSuccessfullyAuthenticated(response.user.uid, response.user.email, displayName, role);
        });
    }

    signUp = () => {
        // Use Firebase Authentication to sign in user
        this.props.firebase.getAuth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(response => {
            this.saveUserInfo(response);
        })
        .catch(error => {
            // Display error message if signed up failed
            this.setState({authenticating: false, errorMessage: error.message})
        });
    }

    signupHandler = () => {
        this.setState({authenticating: true, errorMessage: null});

        if (this.state.confirmPassword !== this.state.password) {
            this.setState({authenticating: false, errorMessage: "Passwords entered are not matched"})
        }
        else {
            this.signUp();
        }
    }

    keyPressedHandler = (event) => {
        if (event.keyCode === 13 || event.which === 13) {
            if (!this.state.errorMessage) {
                if (this.state.showSignin) {
                    this.signinHandler();
                }
                else {
                    this.signupHandler();
                }
            }
            else {
                this.cleanErrorMessageHandler();
            }
        }
    }

    cleanErrorMessageHandler = () => {
        this.setState({errorMessage: null});
    }

    render() {
        // Dynamically determine the CSS classes for sign in & sign up buttons
        const signinButtonCss = [css.Button, css.SigninButton];
        const signupButtonCss = [css.Button, css.SignupButton];
        if (this.state.showSignin) {
            signinButtonCss.push(css.Active);
        }
        else {
            signupButtonCss.push(css.Active);
        }

        // Render the elements
        return (
            <Fragment>
                <div className={css.FormContainer} onKeyPress={this.keyPressedHandler}>
                    <h1 className={signinButtonCss.join(" ")} onClick={() => this.switchFormHandler("SIGN IN")}>SIGN IN</h1>
                    <h1 className={signupButtonCss.join(" ")} onClick={() => this.switchFormHandler("SIGN UP")}>SIGN UP</h1>
                    <SigninForm
                        show={this.state.showSignin}
                        email={this.state.email}
                        password={this.state.password}
                        emailChangedHandler={this.emailChangedHandler}
                        passwordChangedHandler={this.passwordChangedHandler}
                        signinHandler={this.signinHandler} />
                    <SignupForm
                        show={!this.state.showSignin}
                        email={this.state.email}
                        displayName={this.state.displayName}
                        password={this.state.password}
                        confirmPassword={this.state.confirmPassword}
                        emailChangedHandler={this.emailChangedHandler}
                        displayNameChangedHandler={this.displayNameChangedHandler}
                        passwordChangedHandler={this.passwordChangedHandler}
                        confirmPasswordChangedHandler={this.confirmPasswordChangedHandler}
                        signupHandler={this.signupHandler} />
                </div>
                {this.state.authenticating
                ? <Spinner /> : null}
                {this.state.errorMessage
                ? (
                    <Fragment>
                        <Backdrop closeHandler={this.cleanErrorMessageHandler} />
                        <Modal error width="300px">{this.state.errorMessage}</Modal>
                    </Fragment>
                ) : null}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        firebase: state.misc.firebase
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSuccessfullyAuthenticated: (userId, email, displayName, role) => dispatch(actions.authenticated(userId, email, displayName, role)),
        onLogOut: () => dispatch(actions.logout())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);