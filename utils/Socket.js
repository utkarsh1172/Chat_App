
import { io } from 'socket.io-client';

// Replace with your backend server URL
const SOCKET_URL = 'http://192.168.1.100:5001';

const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Ensures only WebSocket is used
  jsonp: false,
}); 

export default socket; 