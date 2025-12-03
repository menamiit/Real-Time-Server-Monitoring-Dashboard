const { execSync } = require('child_process');
const os = require('os');

function getNetworkMetrics() {
  try {
    const platform = os.platform();
    let activeConnections = 0;

    if (platform === 'win32') {
      // Windows: netstat
      const output = execSync('netstat -an | find "ESTABLISHED"', { encoding: 'utf8' });
      activeConnections = output.split('\n').filter(line => line.trim()).length;
    } else {
      // Linux/Mac: netstat or ss
      try {
        const output = execSync('netstat -an 2>/dev/null | grep ESTABLISHED', { encoding: 'utf8' });
        activeConnections = output.split('\n').filter(line => line.trim()).length;
      } catch {
        // Fallback to ss if netstat not available
        const output = execSync('ss -tan | grep ESTAB', { encoding: 'utf8' });
        activeConnections = output.split('\n').filter(line => line.trim()).length;
      }
    }

    // Get network interfaces
    const interfaces = os.networkInterfaces();
    let bytesReceived = 0;
    let bytesSent = 0;

    // Note: os.networkInterfaces() doesn't provide traffic stats
    // For production, you'd use systeminformation or read /proc/net/dev

    return {
      activeConnections: activeConnections,
      bytesReceived: bytesReceived,
      bytesSent: bytesSent
    };
  } catch (error) {
    console.error('Error collecting network metrics:', error);
    return {
      activeConnections: 0,
      bytesReceived: 0,
      bytesSent: 0
    };
  }
}

module.exports = getNetworkMetrics;