//bodyType.model.js
// This file defines the Mongoose schema and model for storing user body type measurements.

const mongoose = require('mongoose');

const bodyTypeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // BMI snapshot at time of body type calculation
    height: { type: Number },
    weight: { type: Number },
    bmi: { type: Number },
    bmiCategory: { type: String },

    // Body measurements
    wrist: { type: Number },
    ankle: { type: Number },
    hip: { type: Number },
    waist: { type: Number },
    shoulder: { type: Number },
    bodyType: { type: String },
    bodyTypeDescription: { type: String },

    date: {
        type: Date,
        default: Date.now
    }
});

const BodyType = mongoose.model('BodyType', bodyTypeSchema);
module.exports = BodyType;
