const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mechanic',
        required: true
    },
    serviceType: {
        type: String,
        enum: ['Tyre Puncture', 'Battery Jump', 'Towing', 'Engine Issue', 'Fuel Delivery', 'Other'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    description: {
        type: String
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    userName: {
    type: String
},

vehicleType: {
    type: String
},
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);