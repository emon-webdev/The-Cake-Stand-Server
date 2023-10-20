const mongoose = require('mongoose');

//menu schema design
const menuSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        // unique:true
    },
    recipe: String,
    description: {
        type: String,
    },
    image: {
        type: String,
        // required: true
    },
    category: String,
    price: {
        type: Number,
        // required: true,
        min: [0, "Price Can't be negative"]
    },
    unit: {
        type: String,
        // required: true,
        enum: {
            values: ['kg', 'litre', 'pcs'],
            message: 'Unit value can"t be {value}, must be kg/litre/pcs '
        }
    },
    quantity: {
        type: Number,
        // required: true,
        min: [0, 'quantity can"t be negative'],
        validate: {
            validator: (value) => {
                const isInteger = Number.isInteger(value)
                if (isInteger) {
                    return true
                } else {
                    return false
                }
            }
        },
        message: "Quantity must be an integer"
    },
    status: {
        type: String,
        // required: true,
        enum: {
            values: ["in-stock", "out-of-stock", "discontinued"],
            message: "status can't be {VALUE} "
        },

    },
    // supplier: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "supplier"
    // },
    // categories: [{
    //     name: {
    //         type: String,
    //         // required:true
    //     },
    //     _id: mongoose.Schema.Types.ObjectId,
    // }]

    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now
    // }

}, {
    timestamps: true,
});

//menu model design
const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu