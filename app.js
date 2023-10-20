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

const menuRoute = require('./src/menu/menu.routes')

//menu routes
//posting to database
app.use('/api/v1/menu', menuRoute)




app.get('/', (req, res) => {
    res.send('The Cake Stand Route is working v1 !!')

})

module.exports = app