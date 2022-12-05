import React, { Component } from 'react';
import PropTypes from 'prop-types';

import css from './AdminPage.module.css';
import BorderedButton from '../../../components/UI/Button/BorderedButton/BorderedButton';
import Title from '../../../components/Admin/Title/Title.js';
import UserList from './UserList/UserList.js';
import QuestionList from './QuestionList/QuestionList.js';

class AdminPage extends Component {
    state = {
        onUser: true
    }

    pageSwitchHandler = (page) => {
        if (page === 'Users') {
            this.setState({onUser: true});
        }
        else if (page === 'Questions') {
            this.setState({onUser: false});
        }
        else {
            this.setState((prevState) => {
                return {onUser: !prevState.onUser};
            });
        }
    }

    render() {
        return (
            <div className={css.AdminPage}>
                <div className={css.NavigationContainer}>
                    <div className={css.Clear}></div>
                    <BorderedButton color="#ff5959" clickedHandler={this.props.goBackHandler}>Go Back</BorderedButton>
                </div>
                <div className={css.PageContainer}>
                    <div className={css.AdminContainer}>
                        <div className={css.TitleContainer}>
                            <Title
                                onUser={this.state.onUser}
                                switchedHandler={this.pageSwitchHandler}
                                clickedHandler={this.pageSwitchHandler} />
                        </div>
                        <div className={css.ContentContainer}>
                            {this.state.onUser
                            ? <UserList />
                            : <QuestionList />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AdminPage.propTypes = {
    goBackHandler: PropTypes.func.isRequired
}

export default AdminPage;