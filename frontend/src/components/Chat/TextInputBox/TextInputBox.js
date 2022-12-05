import React from 'react';

import './TextInputBox.css';
// I took this concept from a online tutorial found here: https://www.youtube.com/watch?v=ZwFA3YMfkoc&ab_channel=JavaScriptMastery
// Although I would argue that I made significant changes compare to the original.
const TextInputBox = ({ setMessage, sendMessage, message }) => {

  const myonKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(e);
    }
  }

  const myonClick = (e) => {
    sendMessage(e)
  }

  return (
    <form className="form">
      <hr />
      <input
        className="textbox"
        type="text"
        placeholder="Type Your Message Here"
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={(e) => myonKeyPress(e)}
      />
      <button className="sendButton rounded text-center"
        onClick={(e) => myonClick(e)}>Send</button>
    </form>
  )
};

export default TextInputBox;