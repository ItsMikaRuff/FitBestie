require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Address = require('./models/address.model');

const VALID_BODY_TYPES = ['אקטומורף', 'מזומורף', 'אנדומורף', null];

(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitbestie');

    const users = await User.find();
    let migrated = 0, skipped = 0, failed = 0;

    for (const user of users) {
        if (
            user.address &&
            typeof user.address === 'object' &&
            (!user.address._bsontype || user.address._bsontype !== 'ObjectID')
        ) {
            try {
                let addr = await Address.create(user.address || {});
                if (!addr || !addr._id) {
                    addr = await Address.create({
                        street: '',
                        city: '',
                        state: '',
                        country: '',
                        zipCode: '',
                        coordinates: { lat: null, lng: null }
                    });
                }
                user.address = addr._id;

                if (
                    user.bodyType &&
                    typeof user.bodyType.type !== 'string'
                ) {
                    user.bodyType.type = null;
                }
                if (
                    user.bodyType &&
                    !VALID_BODY_TYPES.includes(user.bodyType.type)
                ) {
                    user.bodyType.type = null;
                }

                await user.save();
                migrated++;
                console.log(`✅ user ${user.email} עבר המרה לכתובת חדשה: ${addr._id}`);
            } catch (err) {
                failed++;
                console.error('❌ Failed to migrate for', user.email, err);
            }
        } else {
            skipped++;
        }
    }

    console.log(`הסתיים! עברו מיגרציה: ${migrated}, דילג: ${skipped}, נכשל: ${failed}`);
    process.exit();
})();
