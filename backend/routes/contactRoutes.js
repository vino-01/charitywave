const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contact = new Contact({ name, email, phone, message }); 
    await contact.save();
    res.status(201).send('Message sent successfully!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;