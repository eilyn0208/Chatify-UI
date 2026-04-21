import {socket} from "../../socket.js";

const ManageConnection = () => {

    const onConnect = () => {
        console.log("Conectado")
    }

    const onDisconnect = () => {
        console.log("Desconectado")
    }

    const handleConnection = (con) => {
        console.log({con})
        switch (con){
            case 'on': socket.on('connect', onConnect);
                break;
            case 'off': socket.on('disconnect', onDisconnect);
                break;
            default : break;
        }
    };
    return(
       <div>
           <button onClick={() => handleConnection('on')}>Connect </button>
           <button onClick={() => handleConnection('off')}>Disonnect </button>
       </div>
    );


}

export default ManageConnection