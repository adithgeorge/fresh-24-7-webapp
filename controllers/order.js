const { Order, CartItem } = require("../models/order")
const { errorHandler } = require("../helpers/dbErrorHandler");


const createOrder = (req, res) => {
    // console.log('CREATE ORDER: ', req.body);

    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((error, data) => {
        if(error)
        {
            return res.status(400).json({
                error: errorHandler(error)
            })

        }
        
        res.json(data);

    } )


}


const listOrders = (req, res) => {

    Order.find()
    .populate('user', "_id name address")
    .sort('-created')
    .exec((err, orders) => {
        if(err)
        {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json(orders);

        // console.log(res)
    })

}


const getStatusValues = (req, res) => {

    // Why enumValues instead of enum

    res.json(Order.schema.path("status").enumValues)

}

const orderById = (req, res, next, id) => {

    Order.findById(id)
    .populate("products.product", 'name price')
    .exec((err, order) => {
        if(err || !order)
        {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        req.order = order;
        next();
    })


}


const updateOrderStatus = (req, res) => {

    Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        else
        {
            res.json(order);
        }
    });
}



module.exports = { createOrder, listOrders, getStatusValues, orderById, updateOrderStatus}