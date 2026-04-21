import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';

const AVATAR_COLORS = [
  '#5865f2', '#eb459e', '#fee75c', '#57f287', '#ed4245',
  '#ffa500', '#1abc9c', '#9b59b6',
];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTime(date) {
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    // El servidor emite (msg, serverOffset)
    function onChatMessage(msg, serverOffset) {
      setMessages(prev => {
        // Evita duplicados por el serverOffset
        if (serverOffset && prev.find(m => m.id === serverOffset)) return prev;
        return [...prev, {
          id: serverOffset || Date.now() + Math.random(),
          text: typeof msg === 'string' ? msg : JSON.stringify(msg),
          author: 'Usuario',
          timestamp: new Date(),
        }];
      });
    }

    socket.on('chat message', onChatMessage);
    return () => { socket.off('chat message', onChatMessage); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages-list">
      <div className="messages-welcome">
        <div className="messages-welcome-icon">💬</div>
        <h2># general</h2>
        <p>Este es el inicio del canal <strong>#general</strong>. ¡Bienvenido a Chatify!</p>
      </div>

      {messages.map((msg, idx) => {
        const prev = messages[idx - 1];
        const isFirst = !prev || prev.author !== msg.author ||
          (msg.timestamp - prev.timestamp) > 5 * 60 * 1000;

        return (
          <div key={msg.id} className={`message-group ${isFirst ? 'first-in-group' : ''}`}>
            {isFirst
              ? <div className="message-avatar" style={{ background: getColor(msg.author) }}>
                  {msg.author.charAt(0).toUpperCase()}
                </div>
              : <div className="message-avatar placeholder" />
            }
            <div className="message-content-wrap">
              {isFirst && (
                <div className="message-meta">
                  <span className="message-author">{msg.author}</span>
                  <span className="message-timestamp">
                    Hoy a las {formatTime(msg.timestamp)}
                  </span>
                </div>
              )}
              <p className="message-text">{msg.text}</p>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default Chat;