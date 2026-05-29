const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true
    },

    vehicleType: {
        type: String,
        required: true
    },

    problem: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'Pending'
    },

    mechanicName: {
   type: String,
   default: ''
},

mechanicPhone: {
   type: String,
   default: ''
},
serviceCharge:{
    type: String,
    default:''

},
    createdAt: {
        type:Date,      
        default:Date.now
   },
   paymentStatus:{
        type:String,
        default:"Pending"
    }




}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);