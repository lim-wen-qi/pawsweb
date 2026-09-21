const express = require('express');
const transporter = require('../config/nodemailer');
const router = express.Router();

// Contact
router.post('/', async (req, res) => {
  const { name, email, message, subject } = req.body;

  try {
    const mailOptions = {
      from: email, 
      to: 'pawsweb.2024@gmail.com',
      replyTo: email, 
      subject: `Contact Form Submission: ${subject}`,

      text: `You have received a new message from the contact form on your website.\n\n `+
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Subject: ${subject}\n\n` +
            `Message:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
  }
});

module.exports = router;
