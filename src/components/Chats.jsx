import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';

const AVATAR_COLORS = [
  '#5865f2', '#eb459e', '#57f287', '#ed4245', '#ffa500',
];

// ← Fuera del componente, no se reinicia
const seenIds = new Set();

function getColor(name) {
  const index = name.length % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function formatTime(date) {
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    function onChatMessage(msg, serverOffset) {
      // Si ya vimos este ID, ignorar completamente
      if (serverOffset && seenIds.has(serverOffset)) return;
      if (serverOffset) seenIds.add(serverOffset);

      if (serverOffset) {
        socket.auth.serverOffset = serverOffset;
      }

      setMessages(prev => [...prev, {
        id: serverOffset || Date.now() + Math.random(),
        text: typeof msg === 'string' ? msg : JSON.stringify(msg),
        author: 'Usuario',
        timestamp: new Date(),
      }]);
    }

    // Asegura que no haya listeners duplicados
    socket.off('chat message', onChatMessage);
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