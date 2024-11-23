const express = require('express');
const router = express.Router();
const { Post, Story } = require('../models');

// List all posts by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.findAll({ where: { user_id: req.params.userId } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Create a new post
router.post('/add', async (req, res) => {
  try {
    const { userId, status, storyId } = req.body;
    const post = await Post.create({
      userId: userId,
      status: status,
      storyId: storyId,
      createdAt: new Date(),
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

module.exports = router;
