const express = require('express')
const router = express.Router()
const cartController = require("./cartController.js")
//get and post menu
router.route('/')
    .get(cartController.getCart)
    .post(cartController.createCart)

//update menu
router.route('/:id')
    .get(cartController.getCartById)
    .put(cartController.updateCart)
    .delete(cartController.deleteCart)


module.exports = router