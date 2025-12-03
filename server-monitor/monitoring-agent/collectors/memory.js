const os = require('os');

function getMemoryMetrics() {
  try {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usagePercent = (usedMemory / totalMemory) * 100;

    return {
      total: totalMemory,
      used: usedMemory,
      free: freeMemory,
      usagePercent: usagePercent
    };
  } catch (error) {
    console.error('Error collecting memory metrics:', error);
    return {
      total: 0,
      used: 0,
      free: 0,
      usagePercent: 0
    };
  }
}

module.exports = getMemoryMetrics;