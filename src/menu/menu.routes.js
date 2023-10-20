const express = require('express')
const router = express.Router()
const productController = require("../controller/menu.controller")
router.route('/')
    .get(productController.getMenu)
    .post(productController.createMenu)


module.exports = router