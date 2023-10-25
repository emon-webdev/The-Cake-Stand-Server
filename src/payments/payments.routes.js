const express = require('express')
const router = express.Router()
const paymentsController = require("./paymentsController")
//get and post menu
router.route('/')
    .get(paymentsController.getPayments)
    .post(paymentsController.createPayments)

//update menu
router.route('/:id')
    .get(paymentsController.getPaymentsById)
    .put(paymentsController.updatePayments)
    .delete(paymentsController.deletePayments)


module.exports = router