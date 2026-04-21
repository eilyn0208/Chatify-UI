import React, { useState } from 'react'
import { socket } from '../socket'  

const MyForm = () => {
    const [message, setMessage] = useState('');

    const handleOnChange = (e) => {
        setMessage(e.target.value);
    }; 
        const handleOnClick = (e) => {
            e.preventDefault();
            socket.emit('chat message', message);
        }


  return (
    <div>
      <input 
      type="text" 
      name='message' 
      value={message} 
      onChange={handleOnChange}
      />
        <button onClick={handleOnClick}>Enviar</button>  
    </div>
  )
}

export default MyForm
