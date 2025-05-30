const express = require('express');
const router = express.Router();
const DonorProfile = require('../models/DonorProfile');
const TaxReceipt = require('../models/TaxReceipt');

// Get donor profile
router.get('/donors/:email', async (req, res) => {
    try {
        const profile = await DonorProfile.findOne({ 'user.email': req.params.email });
        if (!profile) {
            return res.status(404).json({ message: 'Donor profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create or update donor profile
router.post('/donors', async (req, res) => {
    try {
        const profile = await DonorProfile.findOneAndUpdate(
            { 'user.email': req.body.user.email },
            req.body,
            { new: true, upsert: true }
        );
        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update donor preferences
router.patch('/donors/:email/preferences', async (req, res) => {
    try {
        const profile = await DonorProfile.findOneAndUpdate(
            { 'user.email': req.params.email },
            { preferences: req.body },
            { new: true }
        );
        if (!profile) {
            return res.status(404).json({ message: 'Donor profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Set up recurring donation
router.post('/donors/:email/recurring', async (req, res) => {
    try {
        const profile = await DonorProfile.findOne({ 'user.email': req.params.email });
        if (!profile) {
            return res.status(404).json({ message: 'Donor profile not found' });
        }

        profile.recurringDonations.push({
            amount: req.body.amount,
            frequency: req.body.frequency,
            cause: req.body.cause,
            startDate: new Date(),
            nextDonationDate: req.body.nextDonationDate
        });

        await profile.save();
        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get donor's tax receipts
router.get('/donors/:email/tax-receipts', async (req, res) => {
    try {
        const receipts = await TaxReceipt.find({ 'donor.email': req.params.email })
            .sort({ issuedDate: -1 });
        res.json(receipts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get donor's donation history
router.get('/donors/:email/donations', async (req, res) => {
    try {
        const profile = await DonorProfile.findOne({ 'user.email': req.params.email })
            .select('donationHistory');
        if (!profile) {
            return res.status(404).json({ message: 'Donor profile not found' });
        }
        res.json(profile.donationHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update donor impact metrics
router.patch('/donors/:email/impact', async (req, res) => {
    try {
        const profile = await DonorProfile.findOneAndUpdate(
            { 'user.email': req.params.email },
            { 
                $inc: {
                    'impactMetrics.totalDonated': req.body.donationAmount || 0,
                    'impactMetrics.livesImpacted': req.body.livesImpacted || 0,
                    'impactMetrics.projectsSupported': req.body.projectsSupported || 0
                }
            },
            { new: true }
        );
        if (!profile) {
            return res.status(404).json({ message: 'Donor profile not found' });
        }
        res.json(profile.impactMetrics);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add badge to donor profile
router.post('/donors/:email/badges', async (req, res) => {
    try {
        const profile = await DonorProfile.findOne({ 'user.email': req.params.email });
        if (!profile) {
            return res.status(404).json({ message: 'Donor profile not found' });
        }

        profile.badges.push({
            name: req.body.name,
            description: req.body.description,
            dateEarned: new Date(),
            icon: req.body.icon
        });

        await profile.save();
        res.status(201).json(profile.badges);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 