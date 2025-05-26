const mongoose = require('mongoose');
const Address = require('./models/address.model');
const MONGO_URI = 'mongodb+srv://mikadiel:PUkr8Fjaevy6scHt@fitbestiecluster.tzyrr.mongodb.net/FitBestie'; // אותו URI כמו במיגרציה

(async () => {
    await mongoose.connect(MONGO_URI);

    const addr = new Address({
        street: 'Balfour St 19',
        city: 'Rishon LeZion',
        state: 'Center District',
        country: 'Israel',
        zipCode: '',
        coordinates: { lat: 31.9627076, lng: 34.8117459 }
    });
    await addr.save();
    console.log('Saved address:', addr);

    const found = await Address.findById(addr._id);
    console.log('Found address:', found);

    mongoose.disconnect();
})();
