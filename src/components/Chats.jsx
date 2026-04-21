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

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

function formatTime(date) {
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Hoy';
  if (date.toDateString() === yesterday.toDateString()) return 'Ayer';
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    function onChatMessage(msg) {
      console.log('Mensaje desde server:', msg);
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        text: typeof msg === 'string' ? msg : msg.text || JSON.stringify(msg),
        author: typeof msg === 'object' && msg.author ? msg.author : 'Usuario',
        timestamp: new Date(),
      }]);
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
          <React.Fragment key={msg.id}>
            {(!prev || formatDate(msg.timestamp) !== formatDate(prev.timestamp)) && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 16px 8px',
                color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600,
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(79,84,92,0.48)' }} />
                {formatDate(msg.timestamp)}
                <div style={{ flex: 1, height: '1px', background: 'rgba(79,84,92,0.48)' }} />
              </div>
            )}

            <div className={`message-group ${isFirst ? 'first-in-group' : ''}`}>
              {isFirst
                ? <div className="message-avatar" style={{ background: getColor(msg.author) }}>
                    {getInitial(msg.author)}
                  </div>
                : <div className="message-avatar placeholder" />
              }

              <div className="message-content-wrap">
                {isFirst && (
                  <div className="message-meta">
                    <span className="message-author">{msg.author}</span>
                    <span className="message-timestamp">
                      {formatDate(msg.timestamp) === 'Hoy'
                        ? `Hoy a las ${formatTime(msg.timestamp)}`
                        : `${formatDate(msg.timestamp)} ${formatTime(msg.timestamp)}`
                      }
                    </span>
                  </div>
                )}
                <p className="message-text">{msg.text}</p>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default Chat;