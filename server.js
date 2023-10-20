const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const colors = require('colors')

const app = require('./app.js')


async function main() {
    await mongoose.connect(process.env.DATABASE).then(() => {
        console.log(`Database connection is successful` .red.bold)
    });
}
main().catch(err => console.log(err));
// server
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`.yellow.bold)
})