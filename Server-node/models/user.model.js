//user.model.js

const mongoose = require('mongoose')

const baseOptions = {
    discriminatorKey: 'type',
    collection: 'users'
};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },

    name: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['user', 'trainer', 'admin', 'superAdmin', 'manager', 'worker'],
        required: true,
    },
    paymentDetails: {
        cardNumber: {
            type: String,
            required: function () { return this.role === 'trainer' && this.trainerStatus === 'pending'; },
            select: false
        },
        expiryDate: {
            type: String,
            required: function () { return this.role === 'trainer' && this.trainerStatus === 'pending'; },
            select: false
        },
        cvv: {
            type: String,
            required: function () { return this.role === 'trainer' && this.trainerStatus === 'pending'; },
            select: false
        }
    },
    image: {
        type: String,
        required: false,
    },
    expertise: {
        type: [String],
        required: function () { return this.role === 'trainer'; },
        default: []
    },

    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        default: null
    },
    phone: {
        type: String,
        required: false,
        default: ''
    },
    whatsapp: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    },

    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    otpCode: {
        type: String,
        default: null,
        select: false
    },
    otpExpiresAt: {
        type: Date,
        default: null,
        select: false
    },
    resetToken: {
        type: String,
        default: null,
        select: false
    },
    resetTokenExpire: {
        type: Date,
        default: null,
        select: false
    },
    favoriteTrainers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
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
        // bodyType: { type: String, default: null },
        // bodyTypeDescription: { type: String, default: null },
        lastUpdated: { type: Date, default: null }
    },
    weightHistory: [{
        date: Date,
        weight: Number
    }],
    bodyType: {
        type: { type: String, enum: ['אקטומורף', 'מזומורף', 'אנדומורף'], default: null },
        description: { type: String, default: null },
        lastCalculated: { type: Date, default: null }
    },

    experienceYears: {
        type: Number,
        min: 0,
        default: 0
    },
    previousGyms: {
        type: [String],
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    favoriteRecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    }]
}, baseOptions);

const User = mongoose.model('User', userSchema);
module.exports = User;
