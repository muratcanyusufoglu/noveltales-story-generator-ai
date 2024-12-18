const express = require('express');
const router = express.Router();
const { User, Follows } = require('../models');  // Assuming User and Follows models are already defined
const { Op } = require('sequelize');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, role, premium } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create a new user if no existing user is found
    const user = await User.create({ username, email, role, premium });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// View user profile
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// Follow/unfollow other users
router.post('/:id/follow', async (req, res) => {
  try {
    const { followedUserId } = req.body;
    const follow = await Follows.create({
      following_user_id: req.params.id,
      followed_user_id: followedUserId
    });
    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ error: 'Follow action failed' });
  }
});

module.exports = router;
