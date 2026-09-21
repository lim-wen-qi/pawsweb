const express = require('express');
const router = express.Router();
const Educational = require('../models/Educational');
const upload = require('../config/multer');

// Route to get all educational topics
router.get('/', async (req, res) => {
  try {
    const topics = await Educational.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new educational topic
router.post('/', upload.single('image'), async (req, res) => {
  const { topic, titles } = req.body;
  const image = req.file ? req.file.path : null; // Storing image path or you can save it as a Base64 string

  const educational = new Educational({
    topic,
    titles: JSON.parse(titles), // If titles are sent as a JSON string
    image,
  });

  try {
    await educational.save();
    res.status(201).json(educational);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update an existing educational topic
router.put('/:id', upload.single('image'), async (req, res) => {
  const { titles } = req.body;
  const updateData = {
    titles: JSON.parse(titles), // If titles are sent as a JSON string
  };

  if (req.file) {
    updateData.image = req.file.path; // Update the image if a new one is uploaded
  }

  try {
    const educational = await Educational.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(educational);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete an educational topic
router.delete('/:id', async (req, res) => {
  try {
    await Educational.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
