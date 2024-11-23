const express = require('express');
const router = express.Router();
const { Daily } = require('../models');

// Get all daily topics
router.get('/', async (req, res) => {
  try {
    const dailyTopics = await Daily.findAll();
    res.status(200).json(dailyTopics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve daily topics' });
  }
});

// Add a daily topic
router.post('/add', async (req, res) => {
  try {
    const { topicId, date } = req.body;
    const dailyTopic = await Daily.create({ topic_id: topicId, date });
    res.status(201).json(dailyTopic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add daily topic' });
  }
});

module.exports = router;
