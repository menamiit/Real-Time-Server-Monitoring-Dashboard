const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')
const { timeStamp } = require('console')
require('dotenv').congig();

const app = express();
const sever = http.createServer(app);

const io = socketIO(Server, {
    cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL).then(()=> console.log('MongoDB Connected')).catch(err => console.error('MongoDB error: ', err));

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