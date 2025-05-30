require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const donationRoutes = require('./routes/donationRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const impactRoutes = require('./routes/impactRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Basic routes
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/contact.html'));
});

app.get('/volunteer', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/becomevolunteer.html'));
});

app.get('/donation', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/donation.html'));
});

app.get('/campaigns', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/campaigns.html'));
});

app.get('/impact', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/impact.html'));
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/charity_donation_platform';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// API routes
app.use('/api', contactRoutes);
app.use('/api', volunteerRoutes);
app.use('/api', donationRoutes);
app.use('/api', campaignRoutes);
app.use('/api', impactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});