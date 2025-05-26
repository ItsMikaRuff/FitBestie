// models/trainer.model.js
const mongoose = require('mongoose');
const User = require('./user.model');

const TrainerSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    trainerStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    },
    paymentDetails: {
        cardNumber: String,
        expiryDate: String,
        cvv: String
    },
    expertise: [String],
    // address: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Address',
    //     default: null
    // },

    whatsapp: {
        type: String,
        required: false,
        default: ''
    },
    instagram: {
        type: String,
        required: false,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    rating: { type: Number, default: 0 }
});

module.exports = User.discriminator('trainer', TrainerSchema);