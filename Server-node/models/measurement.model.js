//measurement.model.js
// This file defines the Mongoose schema and model for storing user measurements.

const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    height: { type: Number },
    weight: { type: Number },
    bmi: { type: Number },
    bmiCategory: { type: String },
    date: {
        type: Date,
        default: Date.now
    },
    notes: { type: String },
    goals: { type: String }
});

const Measurement = mongoose.model('Measurement', measurementSchema);
module.exports = Measurement;
