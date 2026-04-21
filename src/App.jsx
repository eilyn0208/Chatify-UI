import { useEffect, useState } from 'react';
import './App.css';
import { socket } from './socket';

import ManageConnection from './components/ManageConnection';
import MyForm from './components/MyForm';
import Channels from './components/Channels';
import Chats from './components/Chats';
import Users from './components/Users';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Conectado");
    }
    function onDisconnect() {
      setIsConnected(false);
      console.log("Desconectado");
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="discord-app">

      {/* Servers sidebar */}
      <nav className="servers-sidebar">
        <div className="server-icon active" title="Chatify">C</div>
        <div className="server-separator" />
        <div className="server-icon" title="Añadir servidor">+</div>
      </nav>

      {/* Channels panel */}
      <aside className="channels-panel">
        <div className="channels-header">
          <span>Chatify</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <div className="channels-scroll">
          <Channels />
        </div>

        <div className="user-area">
          <div className="user-area-avatar">U</div>
          <div className="user-area-info">
            <div className="user-area-name">Usuario</div>
            <div className="user-area-status">
              {isConnected ? '● En línea' : '● Desconectado'}
            </div>
          </div>
          <div className="user-area-actions">
            <ManageConnection isConnected={isConnected} />
          </div>
        </div>
      </aside>

      {/* Main chat */}
      <main className="chat-main">
        <div className="chat-header">
          <span className="chat-header-hash">#</span>
          <span className="chat-header-name">general</span>
          <div className="chat-header-divider" />
          <span className="chat-header-topic">Bienvenido a Chatify</span>
          <div className="chat-header-actions">
            <div className="status-indicator">
              <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
              <span>{isConnected ? 'En línea' : 'Desconectado'}</span>
            </div>
          </div>
        </div>

        <Chats />

        <div className="chat-input-area">
          <MyForm />
        </div>
      </main>

      {/* Members panel */}
      <aside className="members-panel">
        <Users />
      </aside>
    </div>
  );
}

export default App;