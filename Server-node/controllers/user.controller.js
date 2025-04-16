//CRUD - Create Read Update Delete
const express = require('express');
const router = express.Router();

const userModel = require("../models/user.model")

const create = async (data) => {
    try{

        const result = await userModel.create(data)
        return result

    }catch(err){
        console.error("Error creating user: ", err);
        throw new Error("Failed to create user");
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
    return await userModel.findOneAndUpdate(filter, data)
}

const deleteOne = async (filter) => {
    return await userModel.findOneAndDelete(filter)
}


// findOne=array.find
// find = array.filter

module.exports = { create, readOne, read, update, deleteOne }