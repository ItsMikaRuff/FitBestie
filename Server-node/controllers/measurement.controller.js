// controllers/measurement.controller.js
const Measurement = require("../models/measurement.model");
const User = require("../models/user.model");

function bmiCategoryOf(bmi) {
  if (bmi < 18.5) return "תת משקל";
  if (bmi < 25) return "משקל תקין";
  if (bmi < 30) return "עודף משקל";
  if (bmi < 40) return "השמנה";
  return "השמנה חולנית";
}

// יצירה + סנכרון ל-user
const create = async (data) => {
  const { userId, weight } = data;
  let { height, date, bmi, bmiCategory, notes, goals } = data;

  if (!userId) throw new Error("missing userId");
  if (!weight) throw new Error("missing weight");

  const user = await User.findById(userId);
  if (!user) throw new Error("user not found");

  if (!height) height = user.measurements?.height;
  if (!height) throw new Error("missing height");

  const when = date ? new Date(date) : new Date();
  if (!bmi) {
    const m = height / 100;
    bmi = Math.round((weight / (m * m)) * 10) / 10;
  }
  if (!bmiCategory) bmiCategory = bmiCategoryOf(bmi);

  const doc = await Measurement.create({
    userId,
    height,
    weight,
    bmi,
    bmiCategory,
    date: when,
    notes,
    goals,
  });

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        "measurements.height": height,
        "measurements.weight": weight,
        "measurements.bmi": bmi,
        "measurements.bmiCategory": bmiCategory,
        "measurements.lastUpdated": when,
      },
      $push: { weightHistory: { date: when, weight } },
    },
    { new: false }
  );

  return doc;
};

// שליפה
const read = async (filter = {}) => {
  return await Measurement.find(filter).sort({ date: -1 });
};

const readOne = async (filter = {}, projection = null, options = {}) => {
  return await Measurement.findOne(filter, projection, options);
};

// עדכון + סנכרון ל-user
const update = async (filter = {}, newData = {}) => {
  const before = await Measurement.findOne(filter);
  if (!before) return null;

  const updated = await Measurement.findOneAndUpdate(filter, newData, { new: true });
  const userId = updated.userId;

  if (before.date) {
    await User.updateOne({ _id: userId }, { $pull: { weightHistory: { date: before.date } } });
  }
  await User.updateOne(
    { _id: userId },
    { $push: { weightHistory: { date: updated.date, weight: updated.weight } } }
  );

  const latest = await Measurement.findOne({ userId }).sort({ date: -1 });
  await User.updateOne(
    { _id: userId },
    latest
      ? {
          $set: {
            "measurements.height": latest.height,
            "measurements.weight": latest.weight,
            "measurements.bmi": latest.bmi,
            "measurements.bmiCategory": latest.bmiCategory,
            "measurements.lastUpdated": latest.date,
          },
        }
      : {
          $set: {
            "measurements.height": null,
            "measurements.weight": null,
            "measurements.bmi": null,
            "measurements.bmiCategory": null,
            "measurements.lastUpdated": null,
          },
        }
  );

  return updated;
};

// מחיקה + סנכרון ל-user
const deleteOne = async (filter = {}) => {
  const doc = await Measurement.findOne(filter);
  if (!doc) return null;

  await Measurement.deleteOne({ _id: doc._id });

  await User.updateOne(
    { _id: doc.userId },
    { $pull: { weightHistory: { date: doc.date } } }
  );

  const latest = await Measurement.findOne({ userId: doc.userId }).sort({ date: -1 });
  await User.updateOne(
    { _id: doc.userId },
    latest
      ? {
          $set: {
            "measurements.height": latest.height,
            "measurements.weight": latest.weight,
            "measurements.bmi": latest.bmi,
            "measurements.bmiCategory": latest.bmiCategory,
            "measurements.lastUpdated": latest.date,
          },
        }
      : {
          $set: {
            "measurements.height": null,
            "measurements.weight": null,
            "measurements.bmi": null,
            "measurements.bmiCategory": null,
            "measurements.lastUpdated": null,
          },
        }
  );

  return { deleted: true, _id: doc._id };
};

module.exports = {
  create,
  read,
  readOne,
  update,
  deleteOne,
};
