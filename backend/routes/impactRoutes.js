const express = require('express');
const router = express.Router();
const Impact = require('../models/Impact');
const Campaign = require('../models/Campaign');

// Get all impact reports
router.get('/impact', async (req, res) => {
    try {
        const { campaign, status, sdgGoal } = req.query;
        let query = {};

        if (campaign) query.campaign = campaign;
        if (status) query.status = status;
        if (sdgGoal) query.sdgGoals = sdgGoal;

        const impacts = await Impact.find(query)
            .populate('campaign', 'title category')
            .sort({ 'period.startDate': -1 })
            .select('-__v');
        res.json(impacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get impact report by ID
router.get('/impact/:id', async (req, res) => {
    try {
        const impact = await Impact.findById(req.params.id)
            .populate('campaign', 'title category')
            .select('-__v');
        if (!impact) {
            return res.status(404).json({ message: 'Impact report not found' });
        }
        res.json(impact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new impact report
router.post('/impact', async (req, res) => {
    try {
        // Verify campaign exists
        const campaign = await Campaign.findById(req.body.campaign);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const impact = new Impact(req.body);
        const newImpact = await impact.save();
        res.status(201).json(newImpact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update impact report
router.patch('/impact/:id', async (req, res) => {
    try {
        const impact = await Impact.findById(req.params.id);
        if (!impact) {
            return res.status(404).json({ message: 'Impact report not found' });
        }

        Object.keys(req.body).forEach(key => {
            impact[key] = req.body[key];
        });

        const updatedImpact = await impact.save();
        res.json(updatedImpact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete impact report
router.delete('/impact/:id', async (req, res) => {
    try {
        const impact = await Impact.findById(req.params.id);
        if (!impact) {
            return res.status(404).json({ message: 'Impact report not found' });
        }
        await impact.remove();
        res.json({ message: 'Impact report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add testimonial to impact report
router.post('/impact/:id/testimonials', async (req, res) => {
    try {
        const impact = await Impact.findById(req.params.id);
        if (!impact) {
            return res.status(404).json({ message: 'Impact report not found' });
        }

        impact.testimonials.push(req.body);
        const updatedImpact = await impact.save();
        res.status(201).json(updatedImpact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update impact metrics
router.patch('/impact/:id/metrics', async (req, res) => {
    try {
        const impact = await Impact.findById(req.params.id);
        if (!impact) {
            return res.status(404).json({ message: 'Impact report not found' });
        }

        impact.metrics = {
            ...impact.metrics,
            ...req.body
        };

        const updatedImpact = await impact.save();
        res.json(updatedImpact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add milestone to impact report
router.post('/impact/:id/milestones', async (req, res) => {
    try {
        const impact = await Impact.findById(req.params.id);
        if (!impact) {
            return res.status(404).json({ message: 'Impact report not found' });
        }

        impact.milestones.push(req.body);
        const updatedImpact = await impact.save();
        res.status(201).json(updatedImpact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get impact statistics
router.get('/impact/stats/overview', async (req, res) => {
    try {
        const stats = await Impact.aggregate([
            {
                $group: {
                    _id: null,
                    totalBeneficiaries: { $sum: '$metrics.beneficiariesHelped' },
                    totalVolunteers: { $sum: '$metrics.volunteersEngaged' },
                    totalHours: { $sum: '$metrics.hoursContributed' },
                    totalFunds: { $sum: '$metrics.fundsUtilized' }
                }
            }
        ]);
        res.json(stats[0] || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 