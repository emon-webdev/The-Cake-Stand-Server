const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const { Schema } = mongoose;



// middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"));
/* 
1. Schema => Model => query
*/

//posting to database
//require routes
const productRoute = require('./src/product/product.routes')
const cartRoute = require('./src/cart/cart.routes')
const userRoute = require('./src/user/user.routes')
const reviewsRoute = require('./src/reviews/reviews.routes')

app.get('/', (req, res) => {
    res.send('The Cake Stand App is working v1 !!')

})
// use route
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/review', reviewsRoute)






module.exports = app