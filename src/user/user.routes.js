const express = require('express')
const router = express.Router()
const userController = require("./userController.js")
//get and post menu
router.route('/')
    .get(userController.getUser)
    .post(userController.createUser)

//update menu
router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser)


module.exports = router