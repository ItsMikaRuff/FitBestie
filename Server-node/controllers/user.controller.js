//CRUD - Create Read Update Delete

const express = require('express');
const router = express.Router();

const userModel = require("../models/user.model")

const create = async (data) => {
    try{
        const result = await userModel.create(data)
        return result
    }catch(err){
        console.error("Error creating user: ", err.code, err.errmsg);
        throw {message:"Failed to create user", code: err.code, errmsg: err.errmsg};
    }
};

const readOne = async (filter = {}) => {
    const result = await userModel.findOne(filter)
    return result
}

const read = async (filter = {}) => {
    const result = await userModel.find(filter)
    return result
}

const update = async (filter, data) => {
    try {
        console.log("Updating user with data:", data);
        const user = await userModel.findByIdAndUpdate(
            filter._id,
            { $set: data },
            { new: true, runValidators: true }
        );
        console.log("User updated successfully:", user);
        return user;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

const deleteOne = async (filter) => {
    return await userModel.findOneAndDelete(filter);
};

const searchByLocation = async (location) => {
    try {
        // Search for trainers and studios in the specified location
        const results = await userModel.find({
            $or: [
                { role: 'trainer' },
                { role: 'studio' }
            ],
            'address.city': { $regex: location, $options: 'i' }
        }).select('name email image role expertise address phone whatsapp instagram');

        return results;
    } catch (error) {
        console.error("Error searching by location:", error);
        throw error;
    }
};

const searchByTypeAndLocation = async (query) => {
    try {
        // Search for trainers based on the query
        const results = await userModel.find(query)
            .select('name email image role expertise address phone whatsapp instagram location');

        console.log('Found trainers:', results.length);
        return results;
    } catch (error) {
        console.error("Error searching:", error);
        throw error;
    }
};

// findOne=array.find
// find = array.filter

module.exports = {
    create,
    read,
    readOne,
    update,
    deleteOne,
    searchByLocation,
    searchByTypeAndLocation
};