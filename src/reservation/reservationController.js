const Reservation = require('./reservationModel')

exports.createReservation = async (req, res, next) => {
    try {
        const result = await Reservation.create(req.body)
        res.status(200).json({
            status: 'success',
            message: 'Reviews Data inserted successfully',
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Data is not inserted',
            error: error.message
        })
    }
}




exports.getReservation = async (req, res) => {
    try {
        const result = await Reviews.find({});
        res.status(200).json({
            status: 'success',
            message: 'get the data successfully',
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Can"t get the data',
            error: error.message
        })
    }
}


// single product
exports.getReviewsById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await Reviews.findOne({ _id: id })
        if (!result) {
            res.status(400).json({
                status: 'fail',
                message: 'Can"t find with this id',
                error: error.message

            })
        }
        res.status(200).json({
            status: 'success',
            message: 'get the data successfully',
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Can"t get the data',
            error: error.message
        })
    }
}



//update Reviews
exports.updateReviews = async (req, res, next) => {
    try {
        const { id } = req.params
        // const Reviews = await Reviews.findById(id);
        // const result = await result.set(req.body).save()
        const result = await Cart.updateOne(
            { _id: id },

            { $set: req.body },
            { runValidators: true }
        )
        res.status(200).json({
            status: 'success',
            message: 'Data successfully updated',
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Could"nt update the product',
            error: error.message
        })
    }
}


//delete Reviews
exports.deleteReviews = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await Reviews.deleteOne({ _id: id })
        res.status(200).json({
            status: 'success',
            message: 'Data successfully deleted',
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Could"nt delete the product',
            error: error.message
        })
    }
}

