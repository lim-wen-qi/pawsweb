// In routes/user.js
const express = require('express');
const router = express.Router();

router.get('/user', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("Not authenticated");
  }
});

module.exports = router;

