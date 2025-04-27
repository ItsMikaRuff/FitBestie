const measurementModel = require("../models/measurement.model");

const create = async (data) => {
    try {
        const result = await measurementModel.create(data);
        return result;
    } catch (err) {
        console.error("Error creating measurement: ", err);
        throw { message: "Failed to create measurement", code: err.code };
    }
};

const readOne = async (filter = {}) => {
    const result = await measurementModel.findOne(filter);
    return result;
};

const read = async (filter = {}) => {
    const result = await measurementModel.find(filter).sort({ date: -1 });
    return result;
};

const update = async (filter, data) => {
    const measurement = await measurementModel.findByIdAndUpdate(filter._id, data, { new: true });
    return measurement;
};

const deleteOne = async (filter) => {
    return await measurementModel.findOneAndDelete(filter);
};

module.exports = { create, readOne, read, update, deleteOne }; 