const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URI;


async function connect() {
    
    try{
        await mongoose.connect(MONGO_URL);
        console.log("DB - connection successful");
        
    } catch (error){
        console.log("MongoDB Error: ", error);
        
    }
}

module.exports = {connect}