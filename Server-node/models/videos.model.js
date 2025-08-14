// models/videos.model.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
    {
        muscle: { type: String, required: true, index: true }, // למשל 'abs', 'chest', 'front-arm-left'
        title: { type: String, required: true },
        url: { type: String, required: true }, // כתובת embed
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
