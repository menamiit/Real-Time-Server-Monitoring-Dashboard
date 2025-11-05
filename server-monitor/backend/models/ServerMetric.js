const mongoose = require('mongoose')

const ServerMetricSchema = new mongoose.Schema({
    cpu: {
        usage: Number,
        cores: Number,
        loadAverage: [Number]
    },

    memory: {
        total: Number,
        used: Number,
        free: Number,
        percentUsed: Number
    },

    disk: [{
        filesystem: String,
        size: String,
        used: String,
        available: String,
        usagePercent: Number,
        mountPoint: String
    }],

    network: {
        activeConnections: Number,
        bytesReceived: Number,
        bytesSent: Number
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    serverId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ServerMetric', ServerMetricSchema);