import { WALLET_ID } from "./https";
const socket = new WebSocket('wss://legend.lnbits.com/api/v1/ws/' + WALLET_ID)

const listeners = [];

socket.onmessage = function ({data}) {
    let res = JSON.parse(data.toString());

    if (!res.payment) {
        console.log('Response is not a payment ' + res);
    }

    console.log(res);

    listeners.forEach((listener) => {
        listener(res);
    })
}

// Función para suscribir componentes al WebSocket.
function subscribeToWebSocket(listener) {
    listeners.push(listener);
  
    // Devuelve una función de limpieza para cancelar la suscripción cuando sea necesario.
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }
  
  export { subscribeToWebSocket };