const Product = require("../models/product");
const formidable = require("formidable");
const lodash = require("lodash");
const fs = require("fs")
const { errorHandler } = require("../helpers/dbErrorHandler");

// We will have to create a product using a form and image upload


const createProduct = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        const { name, description, price, category, quantity, delivery } = fields;

        // Checking if all the fields are 

        if (!name || !description || !price || !category || !quantity || !delivery) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }

        let product = new Product(fields);

        // Had to change the filepath and mimetype

        if (files.photo) {

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image size should be less than 1 MB"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json(
                    {
                        error: errorHandler(err)
                    }
                )
            }

            res.json(result);
        })

    })


}


// Finding the Product By Id


const productById = (req, res, next, id) => {

    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: "Product Not Found"
                })
            }

            req.product = product

            // Middleware will be performed and application will continue
            next();

        })

}


// Deleting a Product

const readProduct = (req, res) => {

    req.product.photo = undefined;
    return res.json(req.product);
}


// Remove A Product

const removeProduct = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({
            message: "The product has been deleted sucessfully"
        })
    })

}



const updateProduct = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        // const { name, description, price, category, quantity, delivery } = fields;

        // // Checking if all the fields are 

        // if (!name || !description || !price || !category || !quantity || !delivery) {
        //     return res.status(400).json({
        //         error: "All fields are required"
        //     })
        // }

        // Herer the extend method in lodash helps you to update the fields with new information

        let product = req.product
        product = lodash.extend(product, fields)


        // Had to change the filepath and mimetype

        if (files.photo) {

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image size should be less than 1 MB"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json(
                    {
                        error: errorHandler(err)
                    }
                )
            }

            res.json(result);
        })

    })


}


// Getting/ Returning Products by Sell/ Arrival

// By Sell -- /products?sortBy=sold&order=desc&limit=4

// By Arrival -- /products?sortBy=createdAt&order=desc&limit=4

// if no params are sent, then all products are returned


const listProducts = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 5

    // We will display the products and we will create a request to fetch the other products
    // We wont be returning the photos at first hand

    // Here we are able to populate it with category as category is an object of the database
    // Here we are using the MongoDB APIs
    Product.find().select("-photo")
        .populate("category").sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                })
            }

            res.json(products);
        })

}


// It will find the products based on the request product category
// all other products having the same category will be returned


const listRelatedProducts = (req, res) => {

    let limit = req.query.limit ? req.query.limit : 5;

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate("category", '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                })
            }

            res.json(products);
        })


}


// Getting list of distinct categories
// Categories that are being used by the product schema

const listProductCategories = (req, res) => {

    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "Product Categories not found"
            })
        }

        res.json(categories);
    })
}


// List Products By Search
// We will implement search in react frontend
// We will show categories in checkbox and price range in radio buttons
// as the user clicks on those checkbox and radio buttons
// We will make API request and show the products to user based on what he wants


const listProductsBySearch = (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 5;
    let skip = parseInt(req.body.skip);

    // Contains category Id and price range
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // Greater than and less than as we do in mongo DB

                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }
            else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products based on search not found"
                })
            }

            res.json({
                size: data.length,
                data
            })
        })



}


const productPhoto = (req, res, next) => {

    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)

        return res.send(req.product.photo.data);
    }

    next();

}


const listSearch = (req, res) => {
    //  create query object to hold earch value and category value

    const query = {}

    // Assign search value to query.name
    //  i is for case insensitivity

    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' }
        // Assign category value to query.category
        if (req.query.category && req.query.category != "All") {
            query.category = req.query.category
        }

        // find the product based on query object with 2 properties search and category

        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            else {
                res.json(products)
            }
        }).select('-photo')

    }


}


const decreaseQuantity = (req, res, next) => {

    let bulkOps = req.body.order.products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        }
    })

    Product.bulkWrite(bulkOps, {}, 
        (error, products) => {
            if(error)
            {
                return res.status(400).json({
                    error: 'Could not update product'
                })
            }

            next();
        })

}


module.exports = {
    createProduct, productById, readProduct, removeProduct,
    updateProduct, listProducts, listRelatedProducts,
    listProductCategories, listProductsBySearch, productPhoto, listSearch, decreaseQuantity
}
