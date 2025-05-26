// models/address.model.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
    }
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
