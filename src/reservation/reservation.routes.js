const express = require('express')
const router = express.Router()
const reservationController = require("./reservationController")
//get and post menu
router.route('/')
    .get(reservationController.getReservation)
    .post(reservationController.createReservation)

//update menu
router.route('/:id')
    .get(reservationController.getReservationById)
    .put(reservationController.updateReservation)
    .delete(reservationController.deleteReservation)


module.exports = router