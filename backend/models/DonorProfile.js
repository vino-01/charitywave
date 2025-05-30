const mongoose = require('mongoose');

const donorProfileSchema = new mongoose.Schema({
    user: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: String,
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            postalCode: String
        }
    },
    preferences: {
        isAnonymous: {
            type: Boolean,
            default: false
        },
        receiveNewsletter: {
            type: Boolean,
            default: true
        },
        communicationPreferences: {
            email: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            },
            whatsapp: {
                type: Boolean,
                default: false
            }
        }
    },
    taxInfo: {
        panNumber: String,
        gstNumber: String
    },
    recurringDonations: [{
        amount: Number,
        frequency: {
            type: String,
            enum: ['monthly', 'quarterly', 'annually']
        },
        cause: String,
        startDate: Date,
        nextDonationDate: Date,
        status: {
            type: String,
            enum: ['active', 'paused', 'cancelled'],
            default: 'active'
        }
    }],
    donationHistory: [{
        donationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation'
        },
        amount: Number,
        date: Date,
        cause: String,
        campaign: String,
        taxReceipt: String
    }],
    impactMetrics: {
        totalDonated: {
            type: Number,
            default: 0
        },
        livesImpacted: {
            type: Number,
            default: 0
        },
        projectsSupported: {
            type: Number,
            default: 0
        }
    },
    badges: [{
        name: String,
        description: String,
        dateEarned: Date,
        icon: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update lastUpdated
donorProfileSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

// Add indexes for better query performance
donorProfileSchema.index({ 'user.email': 1 }, { unique: true });
donorProfileSchema.index({ 'impactMetrics.totalDonated': -1 });
donorProfileSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DonorProfile', donorProfileSchema); 