// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

console.log('MongoDB URI:', MONGODB_URI);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Message schema
const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Socket.io
io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // Load last 50 messages
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
    socket.emit('load messages', messages.reverse());
  } catch (err) {
    console.error(err);
  }

  // Receive new messages
  socket.on('chat message', async (data) => {
    try {
      const newMessage = new Message(data);
      const savedMessage = await newMessage.save();
      io.emit('chat message', savedMessage); // emit full saved message
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
