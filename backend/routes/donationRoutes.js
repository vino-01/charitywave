const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');
const json2csv = require('json2csv').parse;
const DonorProfile = require('../models/donorProfile');

// Get donation history
router.get('/donations/history', async (req, res) => {
    try {
        const donations = await Donation.find()
            .sort({ date: -1 })
            .select('-__v');
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Download donation history as CSV
router.get('/donations/download', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 });
        
        const fields = ['date', 'name', 'email', 'amount', 'cause', 'message'];
        const opts = { fields };
        
        const donationsFormatted = donations.map(donation => ({
            ...donation.toObject(),
            date: donation.date.toLocaleDateString(),
            amount: `₹${donation.amount}`
        }));

        const csv = json2csv(donationsFormatted, opts);
        
        res.setHeader('Content-disposition', 'attachment; filename=donation_history.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new donation
router.post('/donations', async (req, res) => {
    try {
        // Create donation record
        const donation = new Donation({
            name: req.body.name,
            email: req.body.email,
            amount: req.body.amount,
            cause: req.body.cause,
            message: req.body.message,
            paymentMethod: 'bank_transfer',
            status: 'pending',
            transactionId: req.body.transactionId || null
        });

        const newDonation = await donation.save();

        // Update donor profile
        try {
            await DonorProfile.findOneAndUpdate(
                { 'user.email': req.body.email },
                {
                    $push: {
                        donationHistory: {
                            donationId: newDonation._id,
                            amount: req.body.amount,
                            date: new Date(),
                            cause: req.body.cause
                        }
                    },
                    $inc: {
                        'impactMetrics.totalDonated': req.body.amount,
                        'impactMetrics.projectsSupported': 1
                    }
                },
                { upsert: true }
            );
        } catch (profileError) {
            console.error('Error updating donor profile:', profileError);
            // Don't fail the donation if profile update fails
        }

        res.status(201).json(newDonation);
    } catch (error) {
        console.error('Donation processing failed:', error);
        res.status(400).json({ 
            message: 'Failed to process donation',
            error: error.message 
        });
    }
});

module.exports = router;