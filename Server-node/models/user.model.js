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
        enum: ['user', 'trainer','Admin', 'Manager'], // אפשרויות למשתמש: user או trainer
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
        required: function() { return this.role === 'trainer'; },
        default: ''
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
    createdAt: {
        type: Date,
        default: Date.now,
    },


})

const user = mongoose.model('user', userSchema)
module.exports = user