//measurement.route.js
// This file defines the routes for handling user measurements.

const express = require("express");
const router = express.Router();
const measurementController = require("../controllers/measurement.controller");

// יצירת מדידה חדשה
router.post("/", async (req, res) => {
    try {
        const result = await measurementController.create(req.body);
        res.send(result);
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
router.delete("/:id", async (req, res) => {
    try {
        const result = await measurementController.deleteOne({ _id: req.params.id });
        if (!result) throw new Error("Measurement not found");
        res.send(result);
    } catch (err) {
        console.error("Error deleting measurement:", err);
        res.status(500).send("Error deleting measurement");
    }
});

module.exports = router;
