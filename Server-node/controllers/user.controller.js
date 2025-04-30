// CRUD - Create Read Update Delete

const express = require('express');
const router = express.Router();

const userModel = require("../models/user.model");
const trainerModel = require("../models/trainer.model");

const createUser = async (data) => {
    try {
        const confirmPassword = data.confirmPassword;  // נשמר לבד
        const userData = { ...data };
        delete userData.confirmPassword;  // מוסר לפני ה־create

        const missingFields = [];

        if (!userData.name) missingFields.push('שם מלא');
        if (!userData.email) missingFields.push('אימייל');
        if (!userData.password) missingFields.push('סיסמה');
        if (!confirmPassword) missingFields.push('אימות סיסמה');
        if (!userData.phone) missingFields.push('מספר טלפון');

        if (userData.role === 'trainer') {
            if (!userData.paymentDetails?.cardNumber) missingFields.push('מספר כרטיס אשראי');
            if (!userData.paymentDetails?.expiryDate) missingFields.push('תוקף כרטיס אשראי');
            if (!userData.paymentDetails?.cvv) missingFields.push('קוד CVV');
        }

        if (missingFields.length > 0) {
            throw new Error(`נא למלא את השדות הבאים: ${missingFields.join(', ')}`);
        }

        if (confirmPassword !== userData.password) {
            throw new Error("אימות הסיסמה אינו תואם");
        }

        let createdUser;
        if (userData.role === 'trainer') {
            createdUser = await trainerModel.create(userData);
        } else {
            createdUser = await userModel.create(userData);
        }

        return createdUser;

    } catch (err) {
        if (err.code === 11000) {
            const duplicatedField = Object.keys(err.keyValue)[0];
            throw new Error(`כבר קיים משתמש עם ${duplicatedField}`);
        }
        throw err;
    }
};



const readOne = async (filter = {}) => {
    const result = await userModel.findOne(filter);
    return result;
};

const read = async (filter = {}) => {
    const result = await userModel.find(filter);
    return result;
};

const update = async (filter, data) => {
    try {
        // נזהה האם המשתמש הוא מאמן או רגיל
        const baseModel = filter.role === 'trainer' ? trainerModel : userModel;

        const user = await baseModel.findByIdAndUpdate(
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
        const results = await userModel.find(query)
            .select('name email image role expertise address phone whatsapp instagram location');

        console.log('Found trainers:', results.length);
        return results;
    } catch (error) {
        console.error("Error searching:", error);
        throw error;
    }
};

module.exports = {
    createUser,
    read,
    readOne,
    update,
    deleteOne,
    searchByLocation,
    searchByTypeAndLocation
};
