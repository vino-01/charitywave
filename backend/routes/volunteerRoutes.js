const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

router.post('/volunteer', async (req, res) => {
  try {
    const { name, email, phone, age, city } = req.body;
    const volunteer = new Volunteer({ name, email, phone, age, city });
    await volunteer.save();
    res.status(201).send('Volunteer registered successfully!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;