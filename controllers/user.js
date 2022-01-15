const { errorHandler } = require("../helpers/dbErrorHandler");
const User = require("../models/user");
const { Order } = require("../models/order")

// Has a next component as it is a middleware

const userById = (req, res, next, id) => {

    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User Not Found'
            })
        }

        req.profile = user;
        next();
    })

}

const readUser = (req, res) => {

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);
}

const updateUser = (req, res) => {

    // Updating the user with details from request body

    User.findOneAndUpdate({ _id: req.profile.id }, { $set: req.body }, { new: true }, (err, user) => {
        if(err)
        {
            return res.status(400).json({
                error: "You are not authorised to perform this action"
            })
        }

        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);

    });

}

const addOrderToUserHistory = (req, res, next) => {

    let history = []

    req.body.order.products.forEach( (item) => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.quantity,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        })
    })

    User.findOneAndUpdate({ _id: req.profile._id }, {$push: {history: history}}, {new: true}, 
        (error, data) => {
            if(error)
            {
                return res.status(400).json({
                    error: 'Could not update user purchase history'
                })
            }

            next();
    } )

}


const purchaseHistory = (req, res) => {

    Order.find({user: req.profile._id })
    .populate('user', '_id name')
    .sort('-created')
    .exec((err, orders) => {

        if(err)
        {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json(orders);

    })


}




module.exports = { userById, readUser, updateUser, addOrderToUserHistory, purchaseHistory}