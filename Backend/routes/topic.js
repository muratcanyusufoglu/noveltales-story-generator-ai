const express = require('express');
const router = express.Router();
const { Topic } = require('../models');

// List available topics
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.findAll();
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve topics' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (topic) {
      res.status(200).json(topic);
    } else {
      res.status(404).json({ error: 'Topic not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve topic' });
  }
});

// Add a new topic
router.post('/add', async (req, res) => {
  try {
    const { title, description } = req.body;
    const topic = await Topic.create({ title, description });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add topic' });
  }
});

module.exports = router;
