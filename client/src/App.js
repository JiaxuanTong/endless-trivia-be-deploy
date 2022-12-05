import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookie from 'universal-cookie';

import axios from './axios';
import './App.css';
import * as actions from './store/actions/actions';
import Firebase from './classes/Firebase';
import Authentication from './containers/Authentication/Authentication';
import MainPage from './containers/Main/MainPage/MainPage';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

class App extends Component {
  state = {
    autoLoginAttempted: false
  }

  connectToFirebase = () => {
    this.props.onFirebaseConnected(new Firebase());
  }

  autoLogin = () => {
    // Try to fetch user data from cookies
    const cookie = new Cookie();
    const userId = cookie.get('userId');
    const email = cookie.get('email');
    const displayName = cookie.get('displayName');
    const role = cookie.get('role');

    if (userId && email && displayName && role) {
      this.props.onSuccessfullyAuthenticated(userId, email, displayName, role);
    }
    this.setState({autoLoginAttempted: true});

    // // Verify the user from backend
    // if (userId) {
    //   axios.get(`/verify-user?userId=${userId}`)
    //       .then(response => this.props.onSuccessfullyAuthenticated(response.data.userId, response.data.email, response.data.displayName, response.data.role))
    //       .finally(() => this.setState({autoLoginAttempted: true}));
    // }
    // else {
    //   this.setState({autoLoginAttempted: true});
    // }
  }

  componentDidMount() {
    this.connectToFirebase();
    this.autoLogin();
  }

  render() {
    return (
        <ThemeProvider theme={theme}>
          <div className="thebase">
            {this.state.autoLoginAttempted ? !this.props.isLoggedIn ? <Authentication /> : <MainPage /> : <LoadingScreen />}
          </div>
        </ThemeProvider>
    );
  }
}

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      head: {
        fontSize: "medium",
        fontWeight: "bold",
        backgroundColor: "#FFB579",
        color: "white",
        '@media (max-width: 780px)': {
          fontSize: "small",
        },
      },
      stickyHeader: {
        zIndex: "0",
        backgroundColor: "#FFB579",
      },
      root: {
        '@media (max-width: 780px)' : {
          padding: "10px",
        }
        
      }
    },
    MuiTable: {
      root: {
        height: "100%",
      }
    }
  }
})

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.userId && state.user.email,
    userId: state.user.userId,
    email: state.user.email,
    displayName: state.user.displayName
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFirebaseConnected: (firebase) => dispatch(actions.firebaseConnected(firebase)),
    onSuccessfullyAuthenticated: (userId, email, displayName, role) => dispatch(actions.authenticated(userId, email, displayName, role))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);