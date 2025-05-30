const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['newsletter', 'campaign_update', 'impact_report', 'emergency_appeal'],
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'sent', 'cancelled'],
        default: 'draft'
    },
    scheduledFor: {
        type: Date
    },
    sentAt: {
        type: Date
    },
    audience: {
        type: String,
        enum: ['all_donors', 'active_donors', 'recurring_donors', 'volunteers', 'custom'],
        required: true
    },
    customAudience: [{
        type: String // email addresses for custom audience
    }],
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign'
    },
    metrics: {
        totalRecipients: {
            type: Number,
            default: 0
        },
        opened: {
            type: Number,
            default: 0
        },
        clicked: {
            type: Number,
            default: 0
        },
        unsubscribed: {
            type: Number,
            default: 0
        }
    },
    attachments: [{
        name: String,
        url: String,
        type: String
    }],
    template: {
        type: String,
        enum: ['standard', 'impact_report', 'emergency', 'thank_you'],
        default: 'standard'
    },
    socialShare: {
        enabled: {
            type: Boolean,
            default: true
        },
        platforms: [{
            type: String,
            enum: ['facebook', 'twitter', 'linkedin', 'whatsapp']
        }]
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update updatedAt
newsletterSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Add indexes for better query performance
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ scheduledFor: 1 });
newsletterSchema.index({ type: 1 });
newsletterSchema.index({ campaign: 1 });

module.exports = mongoose.model('Newsletter', newsletterSchema); 