//measurement.route.js
// This file defines the routes for handling user measurements.

const express = require("express");
const router = express.Router();
const measurementController = require("../controllers/measurement.controller");
const MeasurementModel = require('../models/measurement.model');


// יצירת מדידה חדשה
router.post("/", async (req, res) => {
    try {
        const result = await measurementController.create(req.body);
        res.status(201).send(result);
    } catch (err) {
        console.error("Error creating measurement:", err);
        res.status(500).send({ message: "Error creating measurement", code: err.code });
    }
});

// שליפת כל המדידות לפי מזהה משתמש
router.get("/user/:userId", async (req, res) => {
    try {
        const results = await measurementController.read({ userId: req.params.userId });
        res.send(results);
    } catch (err) {
        console.error("Error getting measurements:", err);
        res.status(500).send("Error getting measurements");
    }
});

// שליפת המדידה האחרונה
router.get("/user/:userId/latest", async (req, res) => {
    try {
        const result = await measurementController.readOne(
            { userId: req.params.userId },
            {},
            { sort: { date: -1 } }
        );
        res.send(result);
    } catch (err) {
        console.error("Error getting latest measurement:", err);
        res.status(500).send("Error getting latest measurement");
    }
});

// עדכון מדידה לפי ID
router.put("/:id", async (req, res) => {
    try {
        const result = await measurementController.update({ _id: req.params.id }, req.body);
        if (!result) throw new Error("Measurement not found");
        res.send(result);
    } catch (err) {
        console.error("Error updating measurement:", err);
        res.status(500).send("Error updating measurement");
    }
});

// מחיקת מדידה לפי ID
router.delete('/:id', async (req, res) => {
  try {
    // const deleted = await MeasurementModel.findByIdAndDelete(req.params.id);
    // if (!deleted) {
    //   return res.status(404).json({ message: 'מדידה לא נמצאה' });
    // }
    // res.status(200).json({ message: 'המדידה נמחקה בהצלחה' });

    const result = await measurementController.deleteOne({ _id: req.params.id });
    if (!result) return res.status(404).json({ message: 'מדידה לא נמצאה' });
    res.status(200).json({ message: 'המדידה נמחקה בהצלחה', ...result });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאה בשרת בעת המחיקה' });
  }
});

module.exports = router;
