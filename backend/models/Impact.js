const mongoose = require('mongoose');

const impactSchema = new mongoose.Schema({
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    metrics: {
        beneficiariesHelped: {
            type: Number,
            default: 0
        },
        volunteersEngaged: {
            type: Number,
            default: 0
        },
        hoursContributed: {
            type: Number,
            default: 0
        },
        fundsUtilized: {
            type: Number,
            default: 0
        }
    },
    outcomes: [{
        title: String,
        description: String,
        date: {
            type: Date,
            default: Date.now
        },
        images: [String],
        metrics: {
            type: Map,
            of: Number
        }
    }],
    testimonials: [{
        name: String,
        role: String, // beneficiary, volunteer, donor
        content: String,
        date: {
            type: Date,
            default: Date.now
        },
        image: String,
        isApproved: {
            type: Boolean,
            default: false
        }
    }],
    reports: [{
        title: String,
        description: String,
        fileUrl: String,
        date: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ['monthly', 'quarterly', 'annual', 'special']
        }
    }],
    milestones: [{
        title: String,
        description: String,
        date: {
            type: Date,
            required: true
        },
        isAchieved: {
            type: Boolean,
            default: false
        },
        image: String
    }],
    sdgGoals: [{
        type: String,
        enum: [
            'no_poverty',
            'zero_hunger',
            'good_health',
            'quality_education',
            'gender_equality',
            'clean_water',
            'clean_energy',
            'decent_work',
            'industry_innovation',
            'reduced_inequalities',
            'sustainable_cities',
            'responsible_consumption',
            'climate_action',
            'life_below_water',
            'life_on_land',
            'peace_justice',
            'partnerships'
        ]
    }],
    period: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    }
});

// Add indexes for better query performance
impactSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
impactSchema.index({ campaign: 1 });
impactSchema.index({ status: 1 });
impactSchema.index({ sdgGoals: 1 });

module.exports = mongoose.model('Impact', impactSchema); 