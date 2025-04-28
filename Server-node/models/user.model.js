const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['user', 'trainer', 'admin', 'superAdmin', 'manager'], // אפשרויות למשתמש: user, trainer, admin, superAdmin, manager
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    expertise: {
        type: [String],
        required: function() { return this.role === 'trainer'; },
        default: []
    },
    location: {
        type: String,
        required: function() { return this.role === 'trainer' || this.role === 'studio'; },
        default: ''
    },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },
        zipCode: { type: String, default: '' },
        coordinates: {
            lat: { type: Number, default: null },
            lng: { type: Number, default: null }
        }
    },
    phone: {
        type: String,
        required: false,
        default: ''
    },
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
    // BMI and body measurements
    measurements: {
        height: { type: Number, default: null },
        weight: { type: Number, default: null },
        bmi: { type: Number, default: null },
        bmiCategory: { type: String, default: null },
        wrist: { type: Number, default: null },
        ankle: { type: Number, default: null },
        hip: { type: Number, default: null },
        waist: { type: Number, default: null },
        shoulder: { type: Number, default: null },
        bodyType: { type: String, default: null },
        bodyTypeDescription: { type: String, default: null },
        lastUpdated: { type: Date, default: null }
    },
    // Body type information
    bodyType: {
        type: { type: String, enum: ['אקטומורף', 'מזומורף', 'אנדומורף', null], default: null },
        description: { type: String, default: null },
        lastCalculated: { type: Date, default: null }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },


})

const user = mongoose.model('user', userSchema)
module.exports = user