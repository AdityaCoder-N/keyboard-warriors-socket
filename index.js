import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import socketConfig from './config/socket.js';
import apiRoutes from './routes/api.js'

const port = process.env.PORT || 8000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Middleware
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/api', apiRoutes);

// Socket.IO Configuration
socketConfig(io);

server.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
