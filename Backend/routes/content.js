const express = require('express');
const router = express.Router();
const { Content } = require('../models');

// Get all content
router.get('/', async (req, res) => {
  try {
    const contents = await Content.findAll();
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve contents' });
  }
});

// Get content by ID
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (content) {
      res.status(200).json(content);
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve content' });
  }
});

// Create new content
router.post('/', async (req, res) => {
  try {
    const { description, type } = req.body;
    const newContent = await Content.create({ description, type });
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// Update content by ID
router.put('/:id', async (req, res) => {
  try {
    const { description, type } = req.body;
    const content = await Content.findByPk(req.params.id);
    if (content) {
      content.description = description;
      content.type = type;
      await content.save();
      res.status(200).json(content);
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Delete content by ID
router.delete('/:id', async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (content) {
      await content.destroy();
      res.status(200).json({ message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

module.exports = router;
