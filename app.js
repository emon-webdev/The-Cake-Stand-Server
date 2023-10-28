const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();

// middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"));

// Define and import routes
const productRoute = require('./src/product/product.routes')
const cartRoute = require('./src/cart/cart.routes')
const userRoute = require('./src/user/user.routes')
const reviewsRoute = require('./src/reviews/reviews.routes')

// Call the setup function from index.js (MongoDB-related routes)
const mongodbRouter = require('./index.js');
app.use('/', mongodbRouter);

// API Route setup
app.use('/api/v1/product', productRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/review', reviewsRoute);

// Root Route
app.get('/', (req, res) => {
    res.send('The Cake Stand App is working v-1.0 !!');
});

module.exports = app