import { rooms, roomStates } from '../config/socket.js';
import { paragraphs } from '../utils/paragraphs.js'

export const joinRoom = (io, socket, { roomId, username }) => {
    if (!rooms[roomId]) {
        rooms[roomId] = [];

        // getting paragraph for room
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        const selectedParagraph = paragraphs[randomIndex];

        roomStates[roomId] = { gameInProgress: false, paragraphIndex:randomIndex, selectedParagraph };

    }
    
    // Checking if a user with the same socket ID already exists in the room
    const existingSocketUser = rooms[roomId].find(user => user.id === socket.id);

    if (existingSocketUser) {
        // If the user is already in the room with the same socket ID, don't add them again 
        const userIndex = rooms[roomId].findIndex(user => user.id === socket.id);
        rooms[roomId][userIndex].isDisconnected=false;
        console.log(`User with socket ID ${socket.id} is already in the room: ${roomId}`);
        return;
    }
    
    if (roomStates[roomId].gameInProgress) {
        socket.emit('gameInProgress', true);
        return;
    }
    // Check for existing usernames and add a suffix if necessary
    let userSuffix = 1;
    let uniqueUsername = username;
    while (rooms[roomId].some(user => user.username === uniqueUsername)) {
        userSuffix += 1;
        uniqueUsername = `${username}_${userSuffix}`;
    }

    rooms[roomId].push({ id: socket.id, username:uniqueUsername, isReady: false, isDisconnected:false });
    socket.join(roomId);

    io.to(roomId).emit('roomUsers', rooms[roomId]);
    socket.emit('paragraph', roomStates[roomId].selectedParagraph);
    
    console.log(`${username} joined room: ${socket.id}`);
}

export const toggleReady = (io, socket, { roomId, isReady }) => {
    if (rooms[roomId]) {
        const user = rooms[roomId].find(user => user.id === socket.id);
        if (user) {
            user.isReady = isReady;
            io.to(roomId).emit('roomUsers', rooms[roomId]);
  
            const allReady = rooms[roomId].every(user => user.isReady);
            if (allReady && rooms[roomId].length>1) {
              roomStates[roomId].gameInProgress = true;
              io.to(roomId).emit('startGame');
            }
        }
    }
};

export const bombPlayers = (io, socket, { roomId,username }) => {
    socket.to(roomId).emit('bombPlayers',{username});
};

export const stopPlayers = (io, socket, { roomId,username }) => {
    socket.to(roomId).emit('stopPlayers',{username});
};

export const gameWon = (io, socket, { roomId, username }) => {
    if (rooms[roomId]) {
        console.log(`Game won by ${username} in room: ${roomId}`);
        
        // Resetting users' ready states
        rooms[roomId].forEach(user => user.isReady = false);
        roomStates[roomId].gameInProgress = false;
        
        io.to(roomId).emit('roomUsers', rooms[roomId]);
  
        // Emitting to the room that the game has been won by the user
        io.to(roomId).emit('gameWon', { users:rooms[roomId], winner: username });
        
        // starting fresh room with new paragraph.
        delete rooms[roomId];
        delete roomStates[roomId];
    }
};

