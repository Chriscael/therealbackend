const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper to validate university email
const validateUniversityEmail = (email) => {
    const regex = /^[a-zA-Z]+\.[a-zA-Z]+@facsciences-uy1\.cm$/;
    return regex.test(email);
};

// Define user type patterns
const studentPattern = /^[0-9]{2}[A-Z][0-9]{4}$/;
const teacherPattern = /^[0-9]{2}[A-Z]{2}[0-9]{4}$/;
const adminPattern = /^[0-9]{2}[A-Z]{2}[0-9]{3}$/;
const CDPattern = /^[0-9]{2}[A-Z]{3}[0-9]{3}$/;

router.post('/signup', async (req, res) => {
    const { identifier, name, email, password, confirmPassword } = req.body;

    if (!identifier || !name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!validateUniversityEmail(email)) {
        return res.status(400).json({ message: "Invalid university email address" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let userType = null;
        if (studentPattern.test(identifier)) userType = 'student';
        else if (teacherPattern.test(identifier)) userType = 'teacher';
        else if (adminPattern.test(identifier)) userType = 'admin';
        else if (CDPattern.test(identifier)) userType = 'CD';

        if (userType) {
            const newUser = await User.create({ identifier, name, email, password: hashedPassword, userType });
            res.json({ success: true, userType: userType });
        } else {
            res.status(400).json({ message: "Invalid identifier" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    const { identifier, email, password } = req.body;
  
    if (!identifier || !email || !password) {
      return res.status(400).json({ message: "Identifier, email, and password are required" });
    }
  
    try {
      const user = await User.findOne({ identifier, email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { userId: user._id, email: user.email, userType: user.userType },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
  
      res.json({ success: true, userType: user.userType, token: token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  module.exports = router;
  