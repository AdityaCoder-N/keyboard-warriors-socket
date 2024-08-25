import express from 'express';
const router = express.Router();
import {rooms, roomStates} from '../config/socket.js'
router.get('/verify-room/:roomId', (req, res) => {
  const { roomId } = req.params;
  if (rooms[roomId]) {
    res.status(200).json({ 
      exists: true,
      gameInProgress: roomStates[roomId]?.gameInProgress || false 
    });
  } else {
    res.status(404).json({ exists: false });
  }
});

export default router;
