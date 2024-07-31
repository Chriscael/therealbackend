const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get user-specific data
router.get('/mydata', authenticateToken, async (req, res) => {
    try {
        const data = await UserData.find({ userId: req.user._id });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Submit data
router.post('/mydata', authenticateToken, async (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).json({ message: "Data is required" });
    }

    try {
        const newData = new UserData({ userId: req.user._id, data });
        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Admin and CD: Get all user data
router.get('/all', authenticateToken, authorizeRole(['admin', 'CD']), async (req, res) => {
    try {
        const allData = await UserData.find();
        res.json(allData);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
