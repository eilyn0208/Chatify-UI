import React, { useState, useRef } from 'react'
import { socket } from '../socket'

const MyForm = () => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleOnChange = (e) => {
    setMessage(e.target.value);
  };

  const handleOnClick = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit('chat message', message);
    setMessage('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleOnClick(e);
    }
  };

  return (
    <div className="chat-input-container">
      <button className="input-attach-btn" title="Adjuntar archivo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      </button>

      <input
        ref={inputRef}
        className="chat-input"
        type="text"
        name="message"
        value={message}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        placeholder="Enviar mensaje a #general"
        autoComplete="off"
      />

      <button className="input-emoji-btn" title="Emoji">😊</button>

      {message.trim() && (
        <button
          className="input-attach-btn"
          onClick={handleOnClick}
          title="Enviar"
          style={{ color: 'var(--brand)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default MyForm;