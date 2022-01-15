import React, { useState, useEffect } from 'react';
import { getBrainTreeClientToken, processPayment, createOrder } from './apiCore';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom'
import DropIn from 'braintree-web-drop-in-react'
import { emptyCart } from './cartHelpers';

const Checkout = ({ products, setRun = f => f, run = undefined }) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    })


    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token


    const getToken = (userId, token) => {
        getBrainTreeClientToken(userId, token)
            .then(data => {
                if (data.error) {
                    setData({ ...data, error: data.error })
                }
                else {
                    // Removed ...data as there was a naming conflict
                    // So only updating the client token
                    setData({ clientToken: data.clientToken })
                }
            })
    }


    useEffect(() => {
        getToken(userId, token)
    }, [])




    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }

    const showCheckout = () => {

        return isAuthenticated() ?
            (
                <div>
                    {showDropIn()}
                </div>
            ) :
            (
                <Link to="/signin">
                    <button className="btn btn-primary">
                        Sign in to checkout
                    </button>
                </Link>

            )

    }

    let deliveryAddress = data.address


    const buyAction = () => {
        // Send the nonce to your server
        // nonce = data.instance.requestPaymentMethod()

        setData({loading: true })

        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then(data => {
                // console.log(data)
                nonce = data.nonce
                // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
                // and also total to be charged 
                // console.log('send nonce and total to process:', nonce, getTotal(products))

                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                };

                processPayment(userId, token, paymentData)
                    .then(response => {
                        // console.log(response)

                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        };

                        // console.log(createOrderData)

                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                emptyCart(() => {
                                    
                                    // run use effect in parent Cart to re render the entire cart

                                    setRun(!run);
                                    
                                    console.log('payment success and empty cart')
                                    
                                    setData({ loading: false, success: true })
                                    // window.location.reload(true)  
                                    // Need to fix refresh bug
                                })
                            })
                            .catch(error => {
                                console.log(error);
                                setData({ loading: false })
                            })

                    })
                    .catch(error => {
                        console.log(error)
                        setData({ loading: false })
                    })


            })
            .catch(error => {
                // console.log('dropin error: ', error)
                setData({ ...data, error: error.message })
            })


    }

    const handleAddress = event => {
        setData({ ...data, address: event.target.value })
    }


    const showError = (error) => {
        return (
            <div className="alert alert-danger"
                style={{ display: error ? '' : 'none' }}>
                {error}
            </div>
        )
    }


    const showSuccess = (success) => {
        return (
            <div className="alert alert-info"
                style={{ display: success ? '' : 'none' }}>
                Thank You! Your payment was successful.
            </div>
        )
    }

    const showLoading = (loading) => {

        return (
            loading &&
            <h2 className="alert alert-info">
                Loading...
            </h2>
        )
    }

    // const redirectUser = () => {
    //     if(data.redirectToHome)
    //     {
    //         return <Redirect to="/" />
    //     }
    // }



    const showDropIn = () => {
        // on Blur will empty the error whenever you click on the page
        return (
            <div onBlur={() => setData({ ...data, error: "" })}>
                {data.clientToken !== null && products.length > 0 ? (
                    <div>
                        <div className="gorm-group mb-3">
                            <label className="text-muted mb-2">
                                Delivery Address:
                            </label>
                            <textarea
                                onChange={handleAddress}
                                className="form-control"
                                value={data.address}
                                placeholder="Please type your delivery address here" />
                        </div>
                        <DropIn options={{
                            authorization: data.clientToken
                        }}
                            onInstance={instance => (data.instance = instance)} />
                        {/* This instance is from the state */}
                        <button
                            className="btn btn-success btn-block"
                            onClick={buyAction}>
                            Pay
                        </button>
                    </div>
                ) : null}
            </div>
        )
    }


    return (
        <div>
            <h2>
                Total: Rs.{getTotal()}
            </h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}

        </div>
    )



}


export default Checkout;