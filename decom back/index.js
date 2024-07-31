const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const authRouter = require("./routes/auth");
const receiptRoutes = require('./routes/receiptRoutes');
const data = require('./routes/data');
const app = express();
const PORT = process.env.PORT || 8000;



// Middleware
app.use(cors());  // Add this line
app.use(express.json());
app.use(authRouter);
app.use(receiptRoutes);
app.use('/data', data);

const DB = process.env.MONGO_URI;


//"mongodb://127.0.0.1:27017/mydb";
async function connect() {
  try {
    await mongoose.connect(DB);
    console.log("Successful connection to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

connect();
app.listen(PORT, () => {
  console.log(`Server started on  port ${PORT}`);
});