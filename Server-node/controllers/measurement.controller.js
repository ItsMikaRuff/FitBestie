//measurement.controller.js
// This file contains the controller logic for handling user measurements.

const Measurement = require("../models/measurement.model");

// יצירה
const create = async (data) => {
    return await Measurement.create(data);
};

// שליפה של כל המדידות לפי פילטר
const read = async (filter = {}) => {
    return await Measurement.find(filter).sort({ date: -1 });
};

// שליפה אחת (אפשרי עם סינון נוסף כמו sort)
const readOne = async (filter = {}, projection = null, options = {}) => {
    return await Measurement.findOne(filter, projection, options);
};

// עדכון לפי תנאי (למשל לפי _id)
const update = async (filter = {}, newData = {}) => {
    return await Measurement.findOneAndUpdate(filter, newData, { new: true });
};

// מחיקה
const deleteOne = async (filter = {}) => {
    return await Measurement.findOneAndDelete(filter);
};

module.exports = {
    create,
    read,
    readOne,
    update,
    deleteOne,
};
