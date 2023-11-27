const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

// Ensure the uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir);
}


// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const upload = multer({ storage: storage });

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } else {
    res.status(400).send('No file uploaded.');
  }
});

// Serve files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Socket.IO connection setup
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('sendMessage', (msg) => {
    io.emit('receiveMessage', msg);
  });

  // Handle image data
  socket.on('sendImage', (msg) => {
    io.emit('receiveImage', msg); // Emit the image data to all clients
  });

  socket.on('typing', (username) => {
    console.log(`${username} is typing`); // Debug log
    socket.broadcast.emit('typing', username);
  });

  socket.on('stopTyping', () => {
    console.log('Stop typing'); // Debug log
    socket.broadcast.emit('stopTyping');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
