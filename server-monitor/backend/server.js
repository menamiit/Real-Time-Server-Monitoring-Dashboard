const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')
const metricsIO = require('./sockets/metricsSocket')(io)
const { timeStamp } = require('console')
const connectDB = require('../../../project-CO2/server/config/db')
require('dotenv').congig();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);
app.set('io', metricsIO);

const io = socketIO(Server, {
    cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/metrics', require('./routes/metrics'));

// Socket.io
require('./sockets/metricsSocket')(io);

// Health check
app.get('/health', (req, res) => {
    res.json({status: 'OK', timestamp: new Date()});
});

const PORT = process.env.PORT || 5000
server.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});