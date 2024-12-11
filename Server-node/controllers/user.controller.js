//CRUD - Create Read Update Delete

const userModel = require("../models/user")

const create = async(data)=>{
    const result = await userModel.create(data)
    return result
};

const readOne = async (filter={}) =>{
    const result = await userModel.findOne(filter)
    return result
}

const read = async (filter={}) =>{
    const result = await userModel.find(filter)
    return result
}

const update = async(filter, data)=>{
    return await userModel.findOneAndUpdate(filter,data)
}

const deleteOne = async (filter) =>{
    return await userModel.findOneAndDelete(filter)
}


// findOne=array.find
// find = array.filter

module.exports = {create, readOne, read, update, deleteOne}