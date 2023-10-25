const User = require('./userModel')

exports.createUser = async (req, res, next) => {
    try {
        const result = await User.create(req.body)
        res.status(200).json({
            status: 'success',
            message: 'User Data inserted successfully',
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'User Data is not inserted',
            error: error.message
        })
    }
}




exports.getUser = async (req, res) => {
    try {
        const product = await User.find({});
        res.status(200).json({
            status: 'success',
            message: 'get the User data successfully',
            data: product
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Can"t get the User data',
            error: error.message
        })
    }
}


// single product
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const User = await User.findOne({ _id: id })
        console.log(User)
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
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        // const menu = await Menu.findById(id);
        // const result = await result.set(req.body).save()
        // console.log(result)
        const result = await User.updateOne(
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
exports.deleteUser = async (req, res, next) => {
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

