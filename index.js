const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view', path.join(__dirname, 'view'));
app.use(express.static('public'));
app.use(express.static('frontend')); // Add this line to serve files from frontend folder

// Socket.IO setup from middleware/socket.js
const initializeSocket = require('./middleware/socket');
const { getUserById, createUser, updateUsername } = require('./model/chat.model');
initializeSocket(server);

// Route to serve the chat application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.post('/api/login', async (req, res) => {
  try {
    const { userId, userName } = req.body;
    if (!userId || !userName) {
      return res.status(400).json({ success: false, message: 'User ID and username are required' });
    }
    // Check if user exists, if not create new user
    const user = await getUserById(userId);
    if (user.length === 0) {
      // Create new user
      await createUser(userId, userName);
    } else {
      // Update username if it's different
      if (user[0].username !== userName) {
        await updateUsername(userId, userName);
      }
    }
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id: userId, name: userName }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Server start
const PORT = 6001;
server.listen(PORT, () => {
  console.log(`⚙️  Node app is running on port ${PORT}`);
});