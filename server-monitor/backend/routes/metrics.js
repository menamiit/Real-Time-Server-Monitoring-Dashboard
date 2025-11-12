const express = require('express');
const router = express.Router();
const ServerMetric = require('../models/ServerMetric');
const auth = require('../middleware/auth');

// POST: recieve metrics from monitoring agent
router.post('/', async (req, res) => {
    try {
        const metric = new ServerMetric(req.body);
        await metric.save();

        // Exit to all connected clients via Socket.io
        req.app.get('io').emit('newMetric', metric);

        res.json({ success: true, metric });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save metric' });
    }
});

// GET: fetch historical metrics (protected)
router.get('/', async (req, res) => {
    try {
        const { serverId, limit = 50 } = req.query;

        const query = serverId ? { serverId } : {};
        const metrics = await ServerMetric.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.json(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});

// GET: get latest metric

router.get('/latest', auth, async (req, res) => {
    try {
        const {serverId} = req.query;
        const query = serverId ? {serverId} : {};

        const metric = await ServerMetric.findOne(query).sort({timestamp: -1});
        res.json(metric);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to fetch latest metric'});
    }
});

module.exports = router;