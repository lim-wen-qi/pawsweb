const express = require('express');
const transporter = require('../config/nodemailer');
const router = express.Router();

// Sponsor
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const mailOptions = {
      from: email, 
      to: 'pawsweb.2024@gmail.com',
      replyTo: email, 
      subject: `Sponsorship Form Submission from ${name}`,

      text: `You have received a new message from the sponsorship form on your website.\n\n `+
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n\n` +
            `Subject: Request to be a Sponsor\n\n` +
            `Message:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Sponsorship form error:', error);
    res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
  }
});

module.exports = router;