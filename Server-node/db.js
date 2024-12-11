const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://mikadiel:PUkr8Fjaevy6scHt@fitbestiecluster.tzyrr.mongodb.net/'

async function connect() {
    
    try{
        await mongoose.connect(MONGO_URL)
        console.log("DB - connection succesfull");
        
    } catch (error){
        console.log("MongoDB Error: ", error);
        
    }
}

module.exports = {connect}