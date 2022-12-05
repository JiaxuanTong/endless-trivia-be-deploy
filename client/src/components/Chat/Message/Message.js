import React from 'react';
import Time from 'react-time';

import './Message.css';

import ReactEmoji from 'react-emoji';
const Message = ({ message: { text, user, time }, name }) => {
  let received_time = new Date(time);

  const style = {
    color: '#'+user.color
  }

  const messageContainerContent = () => {
    if (user.name === name) {
      return (
        <div className="messageContainerRight ">
          <p className="rightEndedText"><Time value={received_time} format="YYYY/MM/DD HH:mm" /></p>
          <p className="rightEndedText" style={style}> {user.name}</p>
          <div className="ownerMessageBox">
            <p className="ownerMessageText">{ReactEmoji.emojify(text)}</p>
          </div>
        </div>
      )
    }
    else{
      return (
        <div className="messageContainerLeft">
          <div className="userMessageBox">
            <p className="userMessageText">{ReactEmoji.emojify(text)}</p>
          </div>
          <p className="leftEndedText" style={style}>{user.name}</p>
          <p className="leftEndedText"><Time value={received_time} format="YYYY/MM/DD HH:mm" /></p>
        </div>
      )
    }
  }

  return (
    messageContainerContent()
  )
};

export default Message;