import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import { Link } from 'react-router-dom'
import moment from 'moment'

const Orders = () => {

    const [orders, setOrders] = useState([])
    const [statusValues, setStatusValues] = useState([])

    const { user, token } = isAuthenticated()

    const loadOrders = () => {

        listOrders(user._id, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    setOrders(data)

                }

            })

    }

    const loadStatusValues = () => {

        getStatusValues(user._id, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    setStatusValues(data)
                }

            })

    }



    useEffect(() => {

        loadOrders()
        loadStatusValues()

    }, [])


    const showOrdersLength = () => {

        if (orders.length > 0) {
            return (
                <h1 className="text-secondary display-4">Total Orders: {orders.length}</h1>
            )
        }
        else {
            return <h1 className="text-danger display-5">No Orders</h1>
        }

    }


    const handleStatusChange = (e, orderId) => {

        updateOrderStatus(user._id, token, orderId, e.target.value)
        .then(data => {
            if(data.error)
            {
                console.log('Status update failed')
            }
            else
            {
                loadOrders()
            }
        })


    }



    const showStatus = (o) => {

        return (
        <div className="form-group">
            <h3 className="mark mb-4">
                Status: {o.status}
            </h3>
            <select className="form-control" onChange={(e) => handleStatusChange(e, o._id)} >
                <option>Update Status</option>
                {statusValues.map((status, i) => {
                    return (
                        <option key={i} value={status}>
                            {status}
                        </option>   
                    )
                } )}
            </select>
        </div>
        )

    }


    const showInput = (key, value) => {
        return (
            <div className="input-group mb-2 me-sm-2">
                <div className="input-group-prepend col-2">
                    <div className="input-group-text justify-content-center">
                        {key}
                    </div>
                </div>
                <input type="text" value={value} className="form-control" readOnly/>
            </div>
        )
    }


    const goBack = () => {
        return (
        <span >
            <Link to="/admin/dashboard" className="text-warning">Back to Dashboard</Link>
        </span>
        )
    }

    return (
        <Layout title="Orders" description={`Manage all orders here.`}>
            <div className="row mt-2">
                <div className="col-md-8 offset-md-2">
                    
                    <span className="row mb-2">
                        {goBack()}
                    </span>
                    
                    {showOrdersLength()}

                    {orders.map((o, i) => {

                        return (
                            <div className="mt-5" key={i} style={{ borderBottom: '5px solid green' }}>
                                <h4 className="mb-5">
                                    <span className="bg-secondary">
                                        Order ID: {o._id}
                                    </span>
                                </h4>

                                <ul className="list-group mb-2">
                                    <li className="list-group-item">
                                        {showStatus(o)}
                                    </li>
                                    <li className="list-group-item">
                                        Transaction ID: {o.transaction_id}
                                    </li>
                                    <li className="list-group-item">
                                        Amount: Rs.{o.amount}
                                    </li>
                                    <li className="list-group-item">
                                        Ordered By: {o.user.name}
                                    </li>
                                    <li className="list-group-item">
                                        Ordered On: {moment(o.createdAt).fromNow()}
                                    </li>
                                    <li className="list-group-item">
                                        Delivery Address: {o.address}
                                    </li>
                                </ul>


                                <h3 className="mt-4 mb-4 font-italic">
                                    Total products in the order: {o.products.length}
                                </h3>

                                {o.products.map((p, i) => {
                                    return (
                                        <div className="mb-4" key={i} style={{ padding: '20px', border: '1px solid green' }}>
                                            {showInput('Product name', p.name)}
                                            {showInput('Product price', p.price)}
                                            {showInput('Product total', p.count)}
                                            {showInput('Product Id', p._id)}
                                        </div>
                                    )
                                })}

                            </div>
                        )

                    })}
                </div>
            </div>
        </Layout>
    )


}


export default Orders;