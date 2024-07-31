
require('module-alias/register');
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Receipt = require('../models/receiptModel'); // Assuming you have a Receipt model
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const mongoose = require('mongoose');

// Helper to validate email address
const validateEmail = (email) => {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email);
};

router.post('/submitreceipt', authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      emailAddress,
      subject,
      agency,
      currency,
      reason,
      phoneNumber,
      operationNumber,
      amount,
      date,
      merchantName,
    } = req.body;

    if (!validateEmail(emailAddress)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const qrData = JSON.stringify({
      fullName,
      emailAddress,
      subject,
      agency,
      currency,
      reason,
      phoneNumber,
      operationNumber,
      amount,
      date,
      merchantName,
    });

    // Generate QR code as a base64 string
    const qrCode = await QRCode.toDataURL(qrData);

    const newReceipt = new Receipt({
      userId: req.user._id,
      fullName,
      emailAddress,
      subject,
      agency,
      currency,
      reason,
      phoneNumber,
      operationNumber,
      amount,
      date,
      merchantName,
      qrCode, // Store the QR code image as base64 string
    });

    const savedReceipt = await newReceipt.save();
    res.status(201).json(savedReceipt);
  } catch (error) {
    console.error('Error saving receipt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to get the latest receipt
router.get('/viewreceipts', authenticateToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id); // Use 'new' to create ObjectId
    console.log("Fetching receipts for user ID: ", userId); // Debugging statement

    const receipts = await Receipt.find({ userId: userId }).sort({ date: -1 });

    console.log("Receipts found: ", receipts); // Debugging statement

    if (receipts.length > 0) {
      res.json(receipts);
    } else {
      res.status(404).send('No receipts found');
    }
  } catch (error) {
    console.error('Error occurred while fetching receipts:', error); // Log the error
    res.status(500).send('An error occurred');
  }
});


// Get all receipts for admin
router.get('/allreceipts', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const receipts = await Receipt.find();
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update school signature
router.put('/receipts/:id/sign', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { schoolSignature } = req.body;

    if (!schoolSignature || schoolSignature.length % 4 !== 0) {
      return res.status(400).json({ message: 'Invalid base64 signature length' });
    }

    const receipt = await Receipt.findByIdAndUpdate(
      id,
      { schoolSignature },
      { new: true }
    );

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;

