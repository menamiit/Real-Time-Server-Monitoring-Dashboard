# Real-Time-Server-Monitoring-Dashboard

```
server-monitor/
├── backend/                 # Express + Socket.io server
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── ServerMetric.js # Metrics schema
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── metrics.js      # Metrics API routes
│   ├── middleware/
│   │   └── auth.js         # JWT verification
│   ├── sockets/
│   │   └── metricsSocket.js # Socket.io handlers
│   ├── .env
│   ├── server.js           # Main entry point
│   └── package.json
│
├── frontend/               # React dashboard
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── MetricCard.js
│   │   │   ├── ChartComponent.js
│   │   │   └── Login.js
│   │   ├── services/
│   │   │   ├── api.js      # API calls
│   │   │   └── socket.js   # Socket.io client
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── monitoring-agent/        # Data collection script
    ├── agent.js            # Main monitoring script
    ├── collectors/
    │   ├── cpu.js
    │   ├── memory.js
    │   ├── disk.js
    │   └── network.js
    ├── .env
    └── package.js
```