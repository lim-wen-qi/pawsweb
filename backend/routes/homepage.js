const express = require('express');
const Homepage = require('../models/Homepage');
const router = express.Router();

// Homepage
router.get('/', async (req, res) => {
  try {
    const content = await Homepage.findOne({ published: true });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
