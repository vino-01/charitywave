const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['education', 'healthcare', 'disaster_relief', 'poverty', 'environment', 'other'],
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    raisedAmount: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft'
    },
    featuredImage: {
        type: String,
        required: true
    },
    gallery: [{
        type: String
    }],
    updates: [{
        date: {
            type: Date,
            default: Date.now
        },
        title: String,
        content: String,
        images: [String]
    }],
    beneficiaries: {
        count: Number,
        description: String
    },
    location: {
        city: String,
        state: String,
        country: String
    },
    organizer: {
        name: String,
        email: String,
        phone: String
    },
    socialSharing: {
        facebook: String,
        twitter: String,
        instagram: String
    },
    tags: [{
        type: String
    }],
    isHighlighted: {
        type: Boolean,
        default: false
    },
    donorCount: {
        type: Number,
        default: 0
    },
    minimumDonation: {
        type: Number,
        default: 100
    },
    suggestedDonations: [{
        amount: Number,
        description: String
    }]
});

// Add indexes for better query performance
campaignSchema.index({ status: 1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ startDate: 1, endDate: 1 });
campaignSchema.index({ isHighlighted: 1 });

module.exports = mongoose.model('Campaign', campaignSchema); 