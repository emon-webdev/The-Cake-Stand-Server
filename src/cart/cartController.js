const Cart = require('./cartModel')

exports.createCart = async (req, res, next) => {
    try {
        const result = await Cart.create(req.body)
        res.status(200).json({
            status: 'success',
            message: 'Cart Data inserted successfully',
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




exports.getCart = async (req, res) => {
    try {
        const product = await Cart.find({});
        res.status(200).json({
            status: 'success',
            message: 'get the data successfully',
            data: product
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
exports.getCartById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Cart.findOne({ _id: id })
        if (!product) {
            res.status(400).json({
                status: 'fail',
                message: 'Can"t find with this id',
                error: error.message

            })
        }
        res.status(200).json({
            status: 'success',
            message: 'get the data successfully',
            data: product
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Can"t get the data',
            error: error.message
        })
    }
}



//update product
exports.updateCart = async (req, res, next) => {
    try {
        const { id } = req.params
        // const menu = await Menu.findById(id);
        // const result = await result.set(req.body).save()
        // console.log(result)
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


//delete menu
exports.deleteCart = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(id)
        const result = await Cart.deleteOne({ _id: id })
        console.log(result)
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

