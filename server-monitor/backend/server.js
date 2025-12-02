const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')
const connectDB = require('./config/db')
require('dotenv').config();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Attach socket handlers
require('./sockets/metricsSocket')(io);

// Make io available to routes if needed
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/metrics', require('./routes/metrics'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});