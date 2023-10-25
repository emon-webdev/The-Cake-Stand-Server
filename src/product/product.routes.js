const express = require('express')
const router = express.Router()
const productController = require("./productController")
//get and post menu
router.route('/')
    .get(productController.getProduct)
    .post(productController.createProduct)

//update menu
router.route('/:id')
    .get(productController.getProductById)
    .put(productController.updateProduct)
    .delete(productController.deleteProduct)


module.exports = router