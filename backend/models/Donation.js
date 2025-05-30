const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    cause: {
        type: String,
        required: true
    },
    donationType: {
        type: String,
        enum: ['one-time', 'monthly', 'quarterly', 'annually'],
        default: 'one-time'
    },
    isGiftAid: {
        type: Boolean,
        default: false
    },
    inHonorOf: {
        name: String,
        email: String,
        notifyOfDonation: Boolean
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    campaign: {
        type: String,
        default: 'general'
    },
    message: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    }
});

// Add index for better query performance
donationSchema.index({ date: -1 });
donationSchema.index({ email: 1 });
donationSchema.index({ campaign: 1 });

module.exports = mongoose.model('Donation', donationSchema);