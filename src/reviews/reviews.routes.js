const express = require('express')
const router = express.Router()
const reviewsController = require("./reviewsController")
//get and post menu
router.route('/')
    .get(reviewsController.getReviews)
    .post(reviewsController.createReviews)

//update menu
router.route('/:id')
    .get(reviewsController.getReviewsById)
    .put(reviewsController.updateReviews)
    .delete(reviewsController.deleteReviews)


module.exports = router