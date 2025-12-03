const si = require('systeminformation');

async function getAdvancedMetrics() {
  try {
    const [cpu, mem, disk, network, osInfo] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.osInfo()
    ]);

    return {
      cpu: {
        usage: cpu.currentLoad,
        cores: cpu.cpus.length,
        loadAverage: [cpu.avgLoad]
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        usagePercent: (mem.used / mem.total) * 100
      },
      disk: disk.map(d => ({
        filesystem: d.fs,
        size: formatBytes(d.size),
        used: formatBytes(d.used),
        available: formatBytes(d.available),
        usagePercent: d.use,
        mountPoint: d.mount
      })),
      network: {
        activeConnections: network.length,
        bytesReceived: network.reduce((sum, n) => sum + n.rx_bytes, 0),
        bytesSent: network.reduce((sum, n) => sum + n.tx_bytes, 0)
      },
      os: {
        platform: osInfo.platform,
        distro: osInfo.distro,
        release: osInfo.release,
        hostname: osInfo.hostname
      }
    };
  } catch (error) {
    console.error('Error with advanced metrics:', error);
    throw error;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = getAdvancedMetrics;