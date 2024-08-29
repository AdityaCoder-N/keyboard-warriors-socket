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

        if (userIndex !== -1) {
          rooms[roomId][userIndex].isDisconnected = true;

          // Store the timeout reference to allow potential clearing
          const disconnectTimeout = setTimeout(() => {
            const recheckUserIndex = rooms[roomId].findIndex(user => user.id === socket.id);
            console.log("User to be cleaned = ",rooms[roomId][recheckUserIndex].username);
            if (recheckUserIndex !== -1 && rooms[roomId][recheckUserIndex].isDisconnected) {
              rooms[roomId].splice(recheckUserIndex, 1);
              io.to(roomId).emit('roomUsers', rooms[roomId]);

              // Clean up the room and state if it's empty
              if (rooms[roomId].length === 0) {
                delete rooms[roomId];
                delete roomStates[roomId];
              }
            }
          }, 15000);

        }
      }
      console.log('user disconnected');
    });
  });
};

export default socketConfig;
