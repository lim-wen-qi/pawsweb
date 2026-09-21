const express = require('express');
const Pet = require('../models/Pet');
const router = express.Router();

router.get('/types', async (req, res) => {
    try {
      const types = await Pet.distinct('type');
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch types' });
    }
  });
  
  router.get('/breeds', async (req, res) => {
    try {
      const breeds = await Pet.distinct('breed');
      res.json(breeds);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch breeds' });
    }
  });
  
  router.get('/sizes', async (req, res) => {
    try {
      const sizes = await Pet.distinct('size');
      res.json(sizes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sizes' });
    }
  });
  
  router.get('/genders', async (req, res) => {
    try {
      const genders = await Pet.distinct('gender');
      res.json(genders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch genders' });
    }
  });

module.exports = router;
