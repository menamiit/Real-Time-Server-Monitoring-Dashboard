const mongoose = require('mongoose');

const ServerMetricSchema = new mongoose.Schema({
  cpu: {
    usage: { type: Number, required: true },
    cores: Number,
    loadAverage: [Number]
  },
  memory: {
    total: { type: Number, required: true },
    used: { type: Number, required: true },
    free: { type: Number, required: true },
    usagePercent: { type: Number, required: true }
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