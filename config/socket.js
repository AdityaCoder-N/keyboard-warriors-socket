import socketController from '../controllers/socketController.js';


export const rooms = {};
export const roomStates = {};

const socketConfig = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Event Handlers
    socketController(io, socket);

    socket.on('disconnect', () => {
        for (const roomId in rooms) {
            const userIndex = rooms[roomId].findIndex(user => user.id === socket.id);
            
            rooms[roomId].splice(userIndex, 1); 
            io.to(roomId).emit('roomUsers', rooms[roomId]);
      
            // Cleaning up the room and state if it's empty
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
                delete roomStates[roomId];
            }
        }
        console.log('user disconnected');
    });
  });
};

export default socketConfig;
