const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token:', err); // Log the error
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    console.log("Decoded token: ", decoded); // Debugging statement

    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.error('User not found'); // Log the error
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Server error:', error); // Log the error
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
