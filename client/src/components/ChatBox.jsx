import React from 'react';

const ChatBox = ({ messages }) => (
  <div className="chat-box">
    {messages.map((msg, i) => (
      <div key={i} className={msg.from === 'user' ? 'user-msg' : 'ai-msg'}>
        {msg.text}
      </div>
    ))}
  </div>
);

export default ChatBox;
