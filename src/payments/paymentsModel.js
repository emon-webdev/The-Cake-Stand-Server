const mongoose = require('mongoose');
//menu schema design
const paymentsSchema = mongoose.Schema({
    name: String,
    menuItemId: String,
    image: String,
    price: Number,
    email: String
}, {
    timestamps: true,
});

//menu model design
const Payments = mongoose.model('Payments', paymentsSchema)

module.exports = Payments