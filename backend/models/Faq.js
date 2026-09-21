const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    blogTitle: String,
    questions: [{ question: String, answer: String }]
  });
  
  const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;