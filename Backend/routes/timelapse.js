const express = require('express');
const router = express.Router();
const { Timelapse } = require('../models');

// List all timelapses
router.get('/', async (req, res) => {
  try {
    const timelapses = await Timelapse.findAll();
    res.status(200).json(timelapses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve timelapses' });
  }
});

// Add a new timelapse
router.post('/add', async (req, res) => {
  try {
    const { date, description } = req.body;
    const timelapse = await Timelapse.create({ date, description });
    res.status(201).json(timelapse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add timelapse' });
  }
});

module.exports = router;
