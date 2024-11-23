const express = require('express');
const router = express.Router();
const { Character, UserCharacter } = require('../models');  // Assuming models are already defined

// List available characters
router.get('/', async (req, res) => {
  try {
    const characters = await Character.findAll();
    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve characters' });
  }
});

// Select a character for a user (limit 5)
router.post('/:id/select', async (req, res) => {
  try {
    const { userId, characterIds } = req.body;
    const existingCharacters = await UserCharacter.count({ where: { userId } });

    if (existingCharacters + characterIds.length > 5) {
      return res.status(400).json({ error: 'User can select up to 5 characters' });
    }

    const userCharacters = await UserCharacter.bulkCreate(
      characterIds.map(characterId => ({ userId, characterId }))
    );
    res.status(201).json(userCharacters);
  } catch (error) {
    res.status(500).json({ error: 'Character selection failed' });
  }
});

module.exports = router;
