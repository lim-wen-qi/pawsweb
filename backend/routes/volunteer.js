const express = require('express');
const transporter = require('../config/nodemailer');
const router = express.Router();

//Volunteer
router.post('/', async (req, res) => {
  const { name, email, phone, message, surrenderAsked, surrenderReason } = req.body;

  try {
    const mailOptions = {
      from: email, 
      to: 'pawsweb.2024@gmail.com',
      replyTo: email, 
      subject: `Volunteer Form Submission from ${name}`,

      text: `You have received a new message from the volunteer form on your website.\n\n `+
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: +65 ${phone}\n\n` +
            `Subject: Request to be a Volunteer\n\n` +
            `Surrender an animal?: ${surrenderAsked}\n` +
            `Surrender Reason: ${surrenderReason}\n` +
            `Message:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Volunteer form error:', error);
    res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
  }
});

module.exports = router;