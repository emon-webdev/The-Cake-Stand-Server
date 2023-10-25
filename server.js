const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const colors = require('colors')

const app = require('./app.js')


async function main() {
    await mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
        console.log(`The Cake Stand App Database connection is successful`.red.bold)
    });
}
main().catch(err => console.log(err));
// server
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`The Cake Stand app listening on port ${port}`.yellow.bold)
})