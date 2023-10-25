const mongoose = require('mongoose');
//menu schema design
const userSchema = mongoose.Schema({
    name: String,
    email: String
}, {
    timestamps: true,
});

//menu model design
const User = mongoose.model('User', userSchema)

module.exports = User