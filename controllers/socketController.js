import { joinRoom,toggleReady, bombPlayers, stopPlayers, gameWon } from "../utils/roomManager.js";

const socketController = (io, socket) => {
  
  socket.on('joinRoom', (data) => joinRoom(io, socket, data));
  
  socket.on('toggleReady', (data) => toggleReady(io, socket, data));
  
  socket.on('bombPlayers', (data) => bombPlayers(io, socket, data));
  
  socket.on('stopPlayers', (data) => stopPlayers(io, socket, data));
  
  socket.on('gameWon', (data) => gameWon(io, socket, data));
  
};

export default socketController;
