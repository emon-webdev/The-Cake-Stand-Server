const Product = require('./productModel')

exports.createProduct = async (req, res, next) => {
    try {
        const result = await Product.create(req.body)
        res.status(200).json({
            status: 'success',
            message: 'Data inserted successfully',
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




exports.getProduct = async (req, res) => {
    try {
        const product = await Product.find({});
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
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findOne({ _id: id })
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
exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        // const menu = await Menu.findById(id);
        // const result = await result.set(req.body).save()
        // console.log(result)
        const result = await Product.updateOne(
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
exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(id)
        const result = await Product.deleteOne({ _id: id })
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


// //update all menu
// exports.bulkUpdateMenu = async (req, res, next) => {
//     try {
//         const result = await Menu.updateMany(
//             { _id: id },
//             req.body,
//             { runValidators: true }
//         )
//         res.status(200).json({
//             status: 'success',
//             message: 'Data successfully updated',
//             data: result
//         })
//     } catch (error) {
//         res.status(400).json({
//             status: 'fail',
//             message: 'Could"nt update the product',
//             error: error.message
//         })
//     }
// }