const mongoose = require('mongoose');

const bodyTypeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // BMI measurements
    height: { type: Number },
    weight: { type: Number },
    bmi: { type: Number },
    bmiCategory: { type: String },
    
    // Body type measurements
    wrist: { type: Number },
    ankle: { type: Number },
    hip: { type: Number },
    waist: { type: Number },
    shoulder: { type: Number },
    bodyType: { type: String },
    bodyTypeDescription: { type: String },
    
    // Additional tracking
    date: {
        type: Date,
        default: Date.now
    },
    notes: { type: String },
    goals: { type: String }
});

const bodyType = mongoose.model('bodyType', bodyTypeSchema);
module.exports = bodyType;
