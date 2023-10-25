const mongoose = require('mongoose');
//menu schema design
const reviewsSchema = mongoose.Schema({
    name: String,
    menuItemId: String,
    image: String,
    price: Number,
    email: String
}, {
    timestamps: true,
});

//menu model design
const Reviews = mongoose.model('Reviews', reviewsSchema)

module.exports = Reviews