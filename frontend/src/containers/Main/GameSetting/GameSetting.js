import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as socketEvents from '../../../constants/socketEvents';
import css from './GameSetting.module.css';
import BorderedButton from '../../../components/UI/Button/BorderedButton/BorderedButton';

// Treat this like a component
// Someone being lazy here :D
function Category(props) {
    return (
        <button className={css.category} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function PrivacyOption(props){
    let option;
    if(props.value === 0)
        option = "public";
    if(props.value === 1)
        option = "private";


    return(
        <button className={css.category} onClick={props.onClick}>
            {/*props.value*/option}
        </button>
    );
}

class GameSetting extends Component{
    constructor(props) {
        super(props);

        this.state = {
            categoryList: [],
            privacyOptions: Array(2).fill(0),
            category: props.category,
            privacy: props.type,
            newLobbyName:props.lobbyName,
        };
    }

    handleCategoryClick(value) {
        this.setState({
            category: value,
        });
    }

    handlePrivacyClick(i) {
        const privacyOptions = this.state.privacyOptions.slice();
        privacyOptions.fill(0);
        privacyOptions[i] = 1;
        let tempArr = [];
        for(let j = 0; j < privacyOptions.length; j++){
            tempArr.push(privacyOptions[j]);
        }

        let pri;
        if(i ===0)
            pri = "public";
        if(i ===1)
            pri ="private";
        this.setState({
            privacyOptions: privacyOptions,
            privacy: pri,
        });
    }
    
    handleNameChange(e){
        let newName = e.target.value;
        this.setState({
            newLobbyName: newName,
        });
    }

    handleApplyClick(){
        let settingChanges = {
            lobbyId: this.props.lobbyId,
            changedName: this.state.newLobbyName,
            changedCategory: this.state.category,
            changedPrivacy: this.state.privacy,
        }
        // settingChanges.lobbyId = '123';
        this.props.socket.getSocket()
            .emit(socketEvents.GAME_SETTING,JSON.stringify(settingChanges), () => {});
        this.handleGoBack();
        this.props.goBackHandler()
    }

    handleGoBack(){
        return;
    }

    renderCategory(i){
        return(
            <Category
                value = {/*this.state.squares[i]*/ i}
                onClick = {() => this.handleCategoryClick(i)}
            />
        )
    }

    renderNameChange(original_Lobby_Name) {
        return (
            <input className={css.LobbyNameInput} value={original_Lobby_Name} onChange={(e) => this.handleNameChange(e)}/>
        );
    }

    renderPrivacy(i){
        return(
            <PrivacyOption
                value = {/*this.state.squares[i]*/ i}
                onClick = {() => this.handlePrivacyClick(i)}
            />
        )
    }

    retrieveCategories = () => {
        this.props.firebase
          .getDatabase()
          .ref("questions")
          .once("value")
          .then((snapshot) => {
            const questions = snapshot.val();
            if (questions) {
              let categoryState = [];
              for (const category in questions) {
                categoryState.push({
                  category,
                });
              }
    
              this.setState({categoryList: categoryState});
              console.log(this.state.categoryList);
            }
          });
      };
    
      componentDidMount() {
        this.retrieveCategories();
      }

    render(){
        const cateList = this.state.categoryList.map(
            (d) => 
            <Category key={d.category}
                value = {d.category}
                onClick = {() => this.handleCategoryClick(d.category)}
            />
            );
        return(
            <div>
                <div className={css.NavigationContainer}>
                <BorderedButton
                    color="#ff5959"
                    clickedHandler={this.props.goBackHandler}
                >
                    Go Back
                </BorderedButton>
                </div>
                <div className={css.PageTitle}>Game Setting</div>
                <div className={css.Board}>
                    <div className={css.BoardTitle1}>{"Lobby's Name"}</div>
                    <div className={css.BoardRow}>
                        {this.renderNameChange(this.state.newLobbyName)}
                    </div>
                </div>
                <div className={css.Board}>
                    <div className={css.BoardTitle2}>{"Choose Category: " + this.state.category}</div>
                    <div className={css.BoardRow + " " + css.categorybody}>
                        {cateList}
                    </div>
                </div>
                <div className={css.Board}>
                    <div className={css.BoardTitle3}>{"Privacy: " + this.state.privacy}</div>
                    <div className={css.BoardRow}>
                        {this.renderPrivacy(0)}
                        {this.renderPrivacy(1)}
                    </div>
                </div>
                <div className={css.DecisionBoard}>
                    <div className={css.button} onClick = {() => this.handleApplyClick()}>Apply</div>
                    {/*<BorderedButton*/}
                    {/*    color="#ff5959"*/}
                    {/*    // onClick = {() => this.handleApplyClick()}*/}
                    {/*    clickedHandler={this.props.goBackHandler, this.props.applyHandler}*/}
                    {/*>*/}
                    {/*    Apply*/}
                    {/*</BorderedButton>*/}
                    {/*<div className={css.button} onClick = {() => this.handleCancelClick()}>Cancel</div>*/}
                </div>

            </div>
        );
    }
}
GameSetting.propTypes = {
    goBackHandler: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
    return {
        displayName: state.user.displayName,
        userId: state.user.userId,
        lobbyId: state.lobby.lobbyId,
        firebase: state.misc.firebase,
        socket: state.misc.socket,
    };
};
export default connect(mapStateToProps)(GameSetting);