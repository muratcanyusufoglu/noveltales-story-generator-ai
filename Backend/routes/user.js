const express = require('express');
const router = express.Router();
const { User, Follows } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, premium } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    console.log('sadadsasd', existingUser, username, email, password, role, premium)

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user if no existing user is found
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword,
      role, 
      premium 
    });
    
    // Remove password from response
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      premium: user.premium
    };
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Remove password from response
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      premium: user.premium
    };

    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// View user profile
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // Exclude password from response
    });
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
