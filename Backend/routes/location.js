const express = require('express');
const router = express.Router();
const { Location } = require('../models');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (error) {
    console.error('Failed to retrieve locations', error);
    res.status(500).json({ error: 'Failed to retrieve locations' });
  }
});

// Get location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Failed to retrieve location', error);
    res.status(500).json({ error: 'Failed to retrieve location' });
  }
});

// Create a new location
router.post('/create', async (req, res) => {
  try {
    const { name, description, era, climate, geography } = req.body;
    const location = await Location.create({
      name,
      description,
      era,
      climate,
      geography
    });
    res.status(201).json(location);
  } catch (error) {
    console.error('Failed to create location', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// Update a location
router.put('/:id', async (req, res) => {
  try {
    const { name, description, era, climate, geography } = req.body;
    const [updated] = await Location.update(
      { name, description, era, climate, geography },
      { where: { id: req.params.id } }
    );

    if (updated) {
      const updatedLocation = await Location.findByPk(req.params.id);
      res.status(200).json(updatedLocation);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Failed to update location', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Delete a location
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Location.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Failed to delete location', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

module.exports = router;
