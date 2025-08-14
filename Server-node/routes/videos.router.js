// routes/videos.router.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const Video = require('../models/videos.model');

// GET /videos?muscle=abs
router.get('/', async (req, res) => {
    try {
        const { muscle } = req.query;
        if (!muscle) return res.json([]);
        const list = await Video.find({ muscle }).sort({ createdAt: -1 }).lean();
        res.json(list);
    } catch (e) {
        console.error('GET /videos error', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /videos  (admin/superAdmin)
router.post('/', requireAuth, requireRole(['admin', 'superAdmin']), async (req, res) => {
    try {
        const { muscle, title, url } = req.body;
        if (!muscle || !title || !url) return res.status(400).json({ message: 'Missing fields' });

        const doc = await Video.create({
            muscle,
            title,
            url,
            createdBy: req.user?.id || null,
        });
        res.status(201).json(doc);
    } catch (e) {
        console.error('POST /videos error', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /videos/:id  (admin/superAdmin) 
router.put('/:id',
    requireAuth,
    requireRole(['admin', 'superAdmin']),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
            if (!title || !title.trim()) {
                return res.status(400).json({ message: 'Title is required' });
            }
            const doc = await Video.findByIdAndUpdate(
                id,
                { $set: { title: title.trim() } },
                { new: true }
            );
            if (!doc) return res.status(404).json({ message: 'Not found' });
            res.json(doc);
        } catch (e) {
            console.error('PUT /videos/:id error', e);
            res.status(500).json({ message: 'Server error' });
        }
    }
);


// DELETE /videos/:id  (admin/superAdmin)
router.delete('/:id', requireAuth, requireRole(['admin', 'superAdmin']), async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Video.findByIdAndDelete(id);
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json({ ok: true });
    } catch (e) {
        console.error('DELETE /videos/:id error', e);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
