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
    ratings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            value: { type: Number, min: 0, max: 5 }
        }
    ],
    rating: { type: Number, default: 0 }

});

module.exports = User.discriminator('trainer', TrainerSchema);