const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        unique: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number, 
        required: true,
        min: 16 
    },
    city: { 
        type: String, 
        required: true 
    },
    skills: [{
        type: String,
        enum: ['teaching', 'medical', 'technical', 'management', 'social_work', 'fundraising', 'other']
    }],
    availability: {
        weekdays: Boolean,
        weekends: Boolean,
        flexible: Boolean
    },
    interests: [{
        type: String,
        enum: ['education', 'healthcare', 'environment', 'elderly_care', 'child_care', 'disaster_relief', 'other']
    }],
    experience: {
        type: String,
        enum: ['none', 'beginner', 'intermediate', 'expert'],
        default: 'none'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'inactive'],
        default: 'pending'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    volunteerHours: {
        type: Number,
        default: 0
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    documents: {
        idProof: String,
        addressProof: String
    },
    preferences: {
        notifyEmail: {
            type: Boolean,
            default: true
        },
        notifySMS: {
            type: Boolean,
            default: false
        }
    }
});

// Add indexes for better query performance
volunteerSchema.index({ email: 1 }, { unique: true });
volunteerSchema.index({ skills: 1 });
volunteerSchema.index({ status: 1 });
volunteerSchema.index({ city: 1 });

module.exports = mongoose.model('Volunteer', volunteerSchema);