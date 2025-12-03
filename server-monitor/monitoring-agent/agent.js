require('dotenv').config();
const axios = require('axios');
const getCpuMetrics = require('./collectors/cpu');
const getMemoryMetrics = require('./collectors/memory');
const getDiskMetrics = require('./collectors/disk');
const getNetworkMetrics = require('./collectors/network');

const API_URL = process.env.API_URL || 'http://localhost:5000/api/metrics';
const SERVER_ID = process.env.SERVER_ID || 'default-server';
const COLLECTION_INTERVAL = parseInt(process.env.COLLECTION_INTERVAL) || 10000;

let isCollecting = false;

async function collectMetrics() {
  if (isCollecting) {
    console.log('⏭Skipping collection - previous collection still in progress');
    return;
  }

  isCollecting = true;
  
  try {
    console.log('\nCollecting metrics...');

    // Collect all metrics
    const [cpu, memory, disk, network] = await Promise.all([
      getCpuMetrics(),
      Promise.resolve(getMemoryMetrics()),
      Promise.resolve(getDiskMetrics()),
      Promise.resolve(getNetworkMetrics())
    ]);

    const metrics = {
      cpu,
      memory,
      disk,
      network,
      serverId: SERVER_ID,
      timestamp: new Date()
    };

    // Log collected data
    console.log('Metrics collected:');
    console.log(`   CPU: ${cpu.usage.toFixed(2)}%`);
    console.log(`   Memory: ${memory.usagePercent.toFixed(2)}% (${(memory.used / 1024 / 1024 / 1024).toFixed(2)} GB used)`);
    console.log(`   Disk: ${disk[0].usagePercent.toFixed(2)}%`);
    console.log(`   Network: ${network.activeConnections} connections`);

    // Send to backend
    const response = await axios.post(API_URL, metrics, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Metrics sent successfully');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to backend server. Is it running?');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Request timeout. Backend server not responding.');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    isCollecting = false;
  }
}

// Initial collection
console.log('Monitoring Agent Started');
console.log(`Sending metrics to: ${API_URL}`);
console.log(`Server ID: ${SERVER_ID}`);
console.log(`Collection interval: ${COLLECTION_INTERVAL / 1000}s\n`);

collectMetrics();

// Set up interval
setInterval(collectMetrics, COLLECTION_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down monitoring agent...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nShutting down monitoring agent...');
  process.exit(0);
});