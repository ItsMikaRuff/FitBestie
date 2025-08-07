//user.controller.js 
// CRUD - Create Read Update Delete

const bcrypt = require('bcrypt');

const userModel = require("../models/user.model");
const trainerModel = require("../models/trainer.model");
const addressModel = require('../models/address.model');


// Create a new user
const createUser = async (data) => {
    try {
        const confirmPassword = data.confirmPassword; // קודם כל לשמור

        const userData = { ...data };
        delete userData.confirmPassword;

        const missingFields = [];

        if (!userData.name) missingFields.push('שם מלא');
        if (!userData.email) missingFields.push('אימייל');
        if (!userData.password) missingFields.push('סיסמה');
        if (!confirmPassword) missingFields.push('אימות סיסמה');

        if (missingFields.length > 0) {
            throw new Error(`נא למלא את השדות הבאים: ${missingFields.join(', ')}`);
        }

        if (userData.password !== confirmPassword) {
            throw new Error("אימות הסיסמה אינו תואם");
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        userData.password = hashedPassword;

        let createdUser;

        if (userData.role === 'trainer') {
            if (!userData.paymentDetails?.cardNumber) missingFields.push('מספר כרטיס אשראי');
            if (!userData.paymentDetails?.expiryDate) missingFields.push('תוקף כרטיס אשראי');
            if (!userData.paymentDetails?.cvv) missingFields.push('קוד CVV');
            if (!userData.phone) missingFields.push('מספר טלפון');

            if (missingFields.length > 0) {
                throw new Error(`נא למלא את השדות הבאים: ${missingFields.join(', ')}`);
            }

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


// Read a user by filter
const readOne = async (filter = {},includePassword = false) => {
    
    if (includePassword) {
        return await userModel.findOne(filter).select('+password').populate('address').lean();
    }
    return await userModel.findOne(filter).populate('address').lean();
};

const read = async (filter = {}) => {
    const result = await userModel.find(filter).populate('address');
    return result;
};


// Save address and return its ID
async function saveAddressAndReturnId(addressObj) {
    const addr = new addressModel(addressObj);
    await addr.save();
    return addr._id;
}

//Update a user by filter
const update = async (filter, data) => {
    try {
        let update = req.body;
        // ניהול address כמזהה
        if (update.address && typeof update.address === 'object' && !update.address._id) {
            // יצירת כתובת חדשה אם מגיע אובייקט ולא ObjectId
            const addressDoc = await AddressModel.create(update.address);
            update.address = addressDoc._id;
        }
        // עדכון המשתמש
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        ).populate('address'); // כדי להחזיר address מלא בתשובה
        res.json(user);
    } catch (error) {
        console.error('🔥 Error updating user:', error);
        res.status(500).json({ error: error.message });
    }
};



// Delete a user by filter
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
        }).select('name email image role expertise address phone whatsapp instagram').populate('address');
        return results;
    } catch (error) {
        console.error("Error searching by location:", error);
        throw error;
    }
};

const searchByTypeAndLocation = async (query) => {
    try {
        const results = await userModel.find(query)
            .select('name email image role expertise address phone whatsapp instagram location').populate('address');

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

