const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(email) {
                // Regex to validate the specific university email format
                return /^[a-zA-Z]+\.[a-zA-Z]+@facsciences-uy1\.cm$/.test(email);
            },
            message: props => `${props.value} is not a valid university email!`
        }
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        require: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;