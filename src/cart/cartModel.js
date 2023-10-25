const mongoose = require('mongoose');
//menu schema design
const cartSchema = mongoose.Schema({
    name: String,
    menuItemId: String,
    image: String,
    price: Number,
    email: String
}, {
    timestamps: true,
});

//menu model design
const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart