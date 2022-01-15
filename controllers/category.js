
const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

// Creating A Category

const createCategory = (req, res) => {

    const category = new Category(req.body);
    category.save((err, data) => {

        if(err)
        {
            res.status(400).json({
                error: errorHandler(err)
            })
        } else 
        {
            res.json({ data });
        }
        

    })

}


// Category By Id MiddleWare

const categoryById = (req, res, next, id) => {
    
    Category.findById(id).exec((err, category) => {

        if(err || !category)
        {
            return res.status(400).json({
                error: "Category does not exist"
            })
        }

        req.category = category
        next();
    })

}

// Read A Category

const readCategory = (req, res) => {

    return res.json(req.category)
}


// Update A Category

const updateCategory = (req, res) => {

    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if(err)
        {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json(data)
    })

}


// Remove A Category


const removeCategory = (req, res) => {

    const category = req.category;
    category.remove((err, data) => {
        if(err)
        {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({
            message: "Category Deleted"
        })
    })

}



// List All Categories

const listCategory = (req, res) => {

    Category.find().exec((err, data) =>
    {
        if(err)
        {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json(data);
    })

}



module.exports = { createCategory, readCategory, updateCategory, removeCategory, categoryById, listCategory }