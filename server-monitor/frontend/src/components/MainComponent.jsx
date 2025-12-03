import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Network, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { metricsAPI } from '../services/api';
import socketService from '../services/socket';
import MetricCard from './MetricCard';
import ChartComponent from './ChartComponent';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentMetric, setCurrentMetric] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Fetch historical data
    const fetchData = async () => {
      try {
        const response = await metricsAPI.getMetrics({ limit: 50 });
        setHistoricalData(response.data.reverse());
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchData();

    // Connect to Socket.io
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    // Listen for new metrics
    socket.on('newMetric', (metric) => {
      setCurrentMetric(metric);
      setHistoricalData((prev) => [...prev.slice(-49), metric]);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const getCpuColor = (usage) => {
    if (usage < 50) return 'green';
    if (usage < 75) return 'yellow';
    return 'red';
  };

  const getMemoryColor = (percent) => {
    if (percent < 60) return 'blue';
    if (percent < 80) return 'yellow';
    return 'red';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Server Monitor Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.username}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600 capitalize">{connectionStatus}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentMetric ? (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="CPU Usage"
                value={currentMetric.cpu.usage.toFixed(1)}
                unit="%"
                icon={Cpu}
                color={getCpuColor(currentMetric.cpu.usage)}
              />
              
              <MetricCard
                title="Memory Usage"
                value={currentMetric.memory.usagePercent.toFixed(1)}
                unit="%"
                icon={Activity}
                color={getMemoryColor(currentMetric.memory.usagePercent)}
              />
              
              <MetricCard
                title="Disk Usage"
                value={currentMetric.disk[0]?.usagePercent.toFixed(1) || 0}
                unit="%"
                icon={HardDrive}
                color="purple"
              />
              
              <MetricCard
                title="Network Connections"
                value={currentMetric.network.activeConnections}
                icon={Network}
                color="blue"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartComponent
                data={historicalData.map(m => ({
                  timestamp: m.timestamp,
                  value: m.cpu.usage
                }))}
                dataKey="value"
                title="CPU Usage Over Time"
                color="#ef4444"
              />
              
              <ChartComponent
                data={historicalData.map(m => ({
                  timestamp: m.timestamp,
                  value: m.memory.usagePercent
                }))}
                dataKey="value"
                title="Memory Usage Over Time"
                color="#3b82f6"
              />
            </div>

            {/* Disk Info */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Disk Information</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left py-2">Filesystem</th>
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Used</th>
                      <th className="text-left py-2">Available</th>
                      <th className="text-left py-2">Usage %</th>
                      <th className="text-left py-2">Mount Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMetric.disk.map((disk, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{disk.filesystem}</td>
                        <td className="py-2">{disk.size}</td>
                        <td className="py-2">{disk.used}</td>
                        <td className="py-2">{disk.available}</td>
                        <td className="py-2">
                          <span className={`font-semibold ${
                            disk.usagePercent > 80 ? 'text-red-600' : 
                            disk.usagePercent > 60 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {disk.usagePercent.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2">{disk.mountPoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Waiting for server data...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;