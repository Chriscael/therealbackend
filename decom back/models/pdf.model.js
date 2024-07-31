// // pdfModel.js
// const mongoose = require('mongoose');

// const pdfSchema = new mongoose.Schema({
//   // Define the schema fields according to your PDF data
//   // For example:
//   title: String,
//   content: String,
//   qrCode: String
// });

// const PDF = mongoose.model('PDF', pdfSchema);

// module.exports = PDF;

// pdfModel.js
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  agence: String,
  devise: String,
  motif: String,
  numeroTelephone: String,
  numeroOperation: String,
  montant: Number,
  date: Date,
  nomCommercant: String,
  pdfContent: Buffer, // Store PDF content as binary data
});

module.exports = mongoose.model('PDF', pdfSchema);

