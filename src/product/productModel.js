const mongoose = require('mongoose');

//menu schema design
const productSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        // unique:true
    },
    recipe: String,
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price Can't be negative"]
    },
    unit: {
        type: String,
        // required: true,
        default: "kg", // Default value set to "kg"
        enum: {
            values: ['kg', 'litre', 'pcs', 'bag', 'pound'],
            message: 'Unit value can"t be {value}, must be kg/litre/pcs/bag/pound  '
        }
    },
    quantity: {
        type: Number,
        // required: true,
        default: 43, // Default value set to 0
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
        default: "in-stock", // Default value set to "in-stock"
        enum: {
            values: ["in-stock", "out-of-stock", "discontinued"],
            message: "status can't be {VALUE}"
        }
    },
    description: {
        type: String,
        default: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
}, {
    timestamps: true,
});

//menu model design
const Product = mongoose.model('Product', productSchema)

module.exports = Product