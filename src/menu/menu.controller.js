const Menu = require('./menuModel')

exports.getMenu = async (req, res) => {
    try {
        const menu = await Menu.find({})
        res.status(200).json({
            status: 'success',
            message: 'get the data successfully',
            data: menu
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Can"t get the data',
            error: error.message
        })
    }
}


exports.createMenu = async (req, res, next) => {
    try {
        const result = await Menu.create(req.body)
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