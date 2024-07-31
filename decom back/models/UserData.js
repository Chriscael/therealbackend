const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: String, required: true }
});

const UserData = mongoose.model('UserData', userDataSchema);
module.exports = UserData;
