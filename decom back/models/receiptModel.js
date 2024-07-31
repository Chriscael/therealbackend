const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  subject: { type: String, required: true },
  agency: { type: String, required: true },
  currency: { type: String, required: true },
  reason: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  operationNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  merchantName: { type: String, required: true },
  qrCode: { type: String, required: true },
  schoolSignature: { type: String, default: '' }, // New field for school signature
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
