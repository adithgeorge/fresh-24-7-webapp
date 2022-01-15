const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema(
    {
        name: 
        {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: 
        {
            type: String,
            required: true,
            maxlength: 2000
        },
        price: 
        {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        category: 
        {
            type: ObjectId,
            ref: 'Category',
            required: true
        },
        quantity: 
        {
            type: Number
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: 
        {
            data: Buffer,
            contentType: String
        },
        delivery: 
        {
            type: Boolean,
            required: true
        }

    }, {
        timestamps: true
    }
);

// The type of the category will refer to a different object in category schema, and it refers to the category model


module.exports = mongoose.model("Product", productSchema);