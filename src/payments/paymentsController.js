const Payments = require('./reviewsModel')

exports.createPayments = async (req, res, next) => {
    try {
        const result = await Payments.create(req.body)
        res.status(200).json({
            status: 'success',
            message: 'Payments Data inserted successfully',
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




exports.getPayments = async (req, res) => {
    try {
        const result = await Payments.find({});
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
exports.getPaymentsById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await Payments.findOne({ _id: id })
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
exports.updatePayments = async (req, res, next) => {
    try {
        const { id } = req.params
        // const Payments= await Payments.findById(id);
        // const result = await result.set(req.body).save()
        const result = await Payments.updateOne(
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
exports.deletePayments = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await Payments.deleteOne({ _id: id })
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

