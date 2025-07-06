import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.102:5001'; // ensure this is reachable from the device

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  jsonp: false,
  autoConnect: true, // optional
});

export default socket;