const express = require("express");
const router = express.Router();
const measurementController = require("../controllers/measurement.controller");

// Create new measurement
router.post("/", async (req, res) => {
    try {
        const measurement = await measurementController.create(req.body);
        res.send(measurement);
    } catch (err) {
        console.error("Error creating measurement:", err);
        res.status(500).send({ message: "Error creating measurement", code: err.code });
    }
});

// Get all measurements for a user
router.get("/user/:userId", async (req, res) => {
    try {
        const measurements = await measurementController.read({ userId: req.params.userId });
        res.send(measurements);
    } catch (err) {
        console.error("Error getting measurements:", err);
        res.status(500).send("Error getting measurements");
    }
});

// Get latest measurement for a user
router.get("/user/:userId/latest", async (req, res) => {
    try {
        const measurement = await measurementController.readOne({ userId: req.params.userId });
        res.send(measurement);
    } catch (err) {
        console.error("Error getting latest measurement:", err);
        res.status(500).send("Error getting latest measurement");
    }
});

// Update measurement
router.put("/:id", async (req, res) => {
    try {
        const measurement = await measurementController.update({ _id: req.params.id }, req.body);
        if (!measurement) throw new Error("Measurement not found");
        res.send(measurement);
    } catch (error) {
        console.error("Error updating measurement:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Delete measurement
router.delete("/:id", async (req, res) => {
    try {
        const measurement = await measurementController.deleteOne({ _id: req.params.id });
        if (!measurement) throw "Measurement not found";
        res.send(measurement);
    } catch (error) {
        res.status(500).send("Error deleting measurement");
    }
});

module.exports = router; 