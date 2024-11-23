const express = require('express');
const router = express.Router();
const { Follows } = require('../models');

// Follow a user
router.post('/:userId/follow', async (req, res) => {
  try {
    const { followedUserId } = req.body;
    const follow = await Follows.create({
      following_user_id: req.params.userId,
      followed_user_id: followedUserId,
    });
    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow a user
router.post('/:userId/unfollow', async (req, res) => {
  try {
    const { followedUserId } = req.body;
    const unfollow = await Follows.destroy({
      where: {
        following_user_id: req.params.userId,
        followed_user_id: followedUserId,
      },
    });
    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

// Get list of users followed by a user
router.get('/:userId/following', async (req, res) => {
  try {
    const following = await Follows.findAll({ where: { following_user_id: req.params.userId } });
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve following users' });
  }
});

module.exports = router;
