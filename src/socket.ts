import { io } from 'socket.io-client';

const SOCKET_URL = 'https://testapi.ghostx.chat'; // Or your actual backend

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
});