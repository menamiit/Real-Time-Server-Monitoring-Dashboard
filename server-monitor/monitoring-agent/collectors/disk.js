const { execSync } = require('child_process');
const os = require('os');

function getDiskMetrics() {
  try {
    const platform = os.platform();
    let diskInfo = [];

    if (platform === 'win32') {
      // Windows: Use wmic
      const output = execSync('wmic logicaldisk get caption,size,freespace', { encoding: 'utf8' });
      const lines = output.trim().split('\n').slice(1); // Skip header
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 3) {
          const caption = parts[0];
          const freeSpace = parseInt(parts[1]) || 0;
          const size = parseInt(parts[2]) || 0;
          const used = size - freeSpace;
          const usagePercent = size > 0 ? (used / size) * 100 : 0;

          diskInfo.push({
            filesystem: caption,
            size: formatBytes(size),
            used: formatBytes(used),
            available: formatBytes(freeSpace),
            usagePercent: usagePercent,
            mountPoint: caption
          });
        }
      });
    } else {
      // Linux/Mac: Use df
      const output = execSync('df -h', { encoding: 'utf8' });
      const lines = output.trim().split('\n').slice(1); // Skip header

      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 6) {
          const filesystem = parts[0];
          const size = parts[1];
          const used = parts[2];
          const available = parts[3];
          const usagePercent = parseFloat(parts[4]) || 0;
          const mountPoint = parts[5];

          // Filter out temporary/virtual filesystems
          if (!filesystem.includes('tmpfs') && !filesystem.includes('devfs')) {
            diskInfo.push({
              filesystem: filesystem,
              size: size,
              used: used,
              available: available,
              usagePercent: usagePercent,
              mountPoint: mountPoint
            });
          }
        }
      });
    }

    return diskInfo.length > 0 ? diskInfo : [{
      filesystem: 'N/A',
      size: '0',
      used: '0',
      available: '0',
      usagePercent: 0,
      mountPoint: '/'
    }];
  } catch (error) {
    console.error('Error collecting disk metrics:', error);
    return [{
      filesystem: 'Error',
      size: '0',
      used: '0',
      available: '0',
      usagePercent: 0,
      mountPoint: '/'
    }];
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = getDiskMetrics;