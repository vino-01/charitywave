const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

// Get all campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const { status, category, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const campaigns = await Campaign.find(query)
            .sort({ startDate: -1 })
            .select('-__v');
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get featured campaigns
router.get('/campaigns/featured', async (req, res) => {
    try {
        const campaigns = await Campaign.find({ 
            isHighlighted: true,
            status: 'active'
        })
        .sort({ startDate: -1 })
        .limit(3)
        .select('-__v');
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get campaign by ID
router.get('/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).select('-__v');
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new campaign
router.post('/campaigns', async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        const newCampaign = await campaign.save();
        res.status(201).json(newCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update campaign
router.patch('/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        Object.keys(req.body).forEach(key => {
            campaign[key] = req.body[key];
        });

        const updatedCampaign = await campaign.save();
        res.json(updatedCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete campaign
router.delete('/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        await campaign.remove();
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add campaign update
router.post('/campaigns/:id/updates', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        campaign.updates.push(req.body);
        const updatedCampaign = await campaign.save();
        res.status(201).json(updatedCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update campaign metrics
router.patch('/campaigns/:id/metrics', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        campaign.raisedAmount = req.body.raisedAmount || campaign.raisedAmount;
        campaign.donorCount = req.body.donorCount || campaign.donorCount;

        const updatedCampaign = await campaign.save();
        res.json(updatedCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 