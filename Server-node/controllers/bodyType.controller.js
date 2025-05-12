const bodyTypeModel = require("../models/bodyType.model");

const create = async (data) => {
    try {
        const result = await bodyTypeModel.create(data);
        return result;
    } catch (err) {
        console.error("Error creating measurement: ", err);
        throw { message: "Failed to create measurement", code: err.code };
    }
};

const readOne = async (filter = {}) => {
    const result = await bodyTypeModel.findOne(filter);
    return result;
};

const read = async (filter = {}) => {
    const result = await bodyTypeModel.find(filter).sort({ date: -1 });
    return result;
};

const update = async (filter, data) => {
    const measurement = await bodyTypeModel.findByIdAndUpdate(filter._id, data, { new: true });
    return measurement;
};

const deleteOne = async (filter) => {
    return await bodyTypeModel.findOneAndDelete(filter);
};

module.exports = { create, readOne, read, update, deleteOne }; 