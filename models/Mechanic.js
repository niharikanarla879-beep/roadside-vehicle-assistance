const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    specialization: {
        type: String,
        default: 'Car Repair'
    },

    location: {
        type: String,
        default: 'Hyderabad'
    },

    experience: {
        type: String,
        default: '2 Years'
    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    role: {
        type: String,
        default: 'mechanic'
    },

    isApproved: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('Mechanic', mechanicSchema);