const mongoose = require('mongoose');

const educationalSchema = new mongoose.Schema({
    topic: String,
    titles: [{ title: String, content: String }],
    image: String,
  });
  
  const Educational = mongoose.model('Educational', educationalSchema);

module.exports = Educational;