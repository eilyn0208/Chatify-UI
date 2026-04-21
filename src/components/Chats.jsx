import React, { use, useEffect } from 'react';
import { socket } from '../socket';

const Chat = () => {
  useEffect(() => {
    // Aquí puedes agregar la lógica para manejar los mensajes del chat
    // Por ejemplo, podrías escuchar eventos de socket para recibir mensajes
    // y actualizar el estado del componente en consecuencia.
    socket.on('chat message', (msg) => {
      console.log('Mensaje desde server:', msg);
      // Aquí podrías actualizar el estado para mostrar el mensaje en la interfaz
    });

    // Limpieza al desmontar el componente
    return () => {
      socket.off('chat message');
    };
  }, []);


  return (
    <div>
      <h2>Chat</h2>
      <p>This is a simple Chat component.</p>
    </div>
  );
};

export default Chat;