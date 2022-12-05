import React from 'react';

import Message from '../Message/Message';

import './Messages.css';
const Messages = ({ messages, name }) => {

  return (
    <div className="messages" id="messages_scroll">
      <div className="wrapper">
        <div className="content" id="MessagesContent">
          {messages.map((message, key) => {
            return (
              <div className="message-wrapper" key={key}>
                <Message message={message} name={name} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
};

export default Messages;