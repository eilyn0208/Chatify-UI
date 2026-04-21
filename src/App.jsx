import { useEffect, useState } from 'react';
import './App.css';
import { socket } from '../socket';

// Importación de componentes según la imagen
import ManageConnection from './components/ManageConnection';
import MyForm from './components/MyForm';
import Channels from './components/Channels';
import Chats from './components/Chats';

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

    // Limpieza al desmontar el componente
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Estructura basada en tu imagen de VS Code */}
      <h1>Chatify</h1>
      
      <ManageConnection />
      
      <Chats />
      
      <Channels />
      
      <MyForm />
      
      {/* Opcional: Si quieres mantener el punto de estado 
         que tenías en tu versión anterior 
      */}
      <div style={{ marginTop: '20px' }}>
        <small>Estado: </small>
        <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}>
          {isConnected ? '🟢 En línea' : '🔴 Desconectado'}
        </span>
      </div>
    </div>
  );
}

export default App;