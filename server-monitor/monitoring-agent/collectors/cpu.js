const os = require('os');
const osUtils = require('node-os-utils');

const cpu = osUtils.cpu;

async function getCpuMetrics() {
  try {
    const usage = await cpu.usage();
    const cores = os.cpus().length;
    const loadAverage = os.loadavg();

    return {
      usage: usage,
      cores: cores,
      loadAverage: loadAverage
    };
  } catch (error) {
    console.error('Error collecting CPU metrics:', error);
    return {
      usage: 0,
      cores: os.cpus().length,
      loadAverage: [0, 0, 0]
    };
  }
}

module.exports = getCpuMetrics;