const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);


// middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"));

// start old  code without mongoose
const run = require('./index.js');
run();
// end old  code

/* 
1. Schema => Model => query
*/

// const oldMongoDBRoute = require('./src/mongoDB/oldApi')
//posting to database
//require routes
const productRoute = require('./src/product/product.routes')
const cartRoute = require('./src/cart/cart.routes')
const userRoute = require('./src/user/user.routes')
const reviewsRoute = require('./src/reviews/reviews.routes')

app.get('/', (req, res) => {
    res.send('The Cake Stand App is working v-2.0 !!')
})
// use route
// app.use('/', oldMongoDBRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/review', reviewsRoute)






module.exports = app