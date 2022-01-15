import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import ShowImage from './ShowImage'
import moment from 'moment'
import { addItem, updateItem, removeItem } from './cartHelpers'
import { useState } from 'react'

const Card = ({ product,
    showViewProductButton = true,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false,
    setRun = f => f, // Default value of function
    run = undefined // Default value of undefined
        
    }) => {

    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);


    const showViewButton = (showViewProductButton) => {
        return (
            showViewProductButton &&
            (
                <Link to={`/product/${product._id}`} className="mr-2">
                    <button className="btn btn-outline-success mt-2 mb-2 me-2">
                        View Product
                    </button>
                </Link>
            )
        )
    }


    const addToCart = () => {
        // Product from the props
        addItem(product, () => {
            setRedirect(true)
        })
    }

    const shouldRedirect = redirect => {
        if (redirect) {
            return <Redirect to="/cart" />
        }
    }

    const handleChange = productId => event => {
        setRun(!run)
        // To make sure we do not have any negative or incorrect values
        setCount(event.target.value < 1 ? 1 : event.target.value )
        if (event.target.value >= 1) {
            updateItem(productId, event.target.value)
        }
    }



    const showCartUpdateOptions = (cartUpdate) => {
        
        // Whenever there is a change in the cart items, we need to re render the parent component and 
        // we need to trigger the useEffect

        return cartUpdate &&
            <div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            Adjust Quantity
                        </span>
                    </div>  
                    <input type="number" 
                    className="form-control"
                    value={count} 
                    onChange={handleChange(product._id)}
                    >
                    </input>
                </div>
            </div>

    }


    const showAddToCart = (showAddToCartButton) => {

        return showAddToCartButton && (
            <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 me-2">
                Add to Card
            </button>
        )
    }

    const showRemoveButton = (showRemoveProductButton) => {

        return showRemoveProductButton && (
            <button 
            onClick={() => {
                removeItem(product._id)
                setRun(!run)  // run useEffect in parent cart
            } } 
            className="btn btn-outline-danger mt-2 mb-2">
               Remove Product
            </button>
        )
    }



    const showStock = (quantity) => {

        return quantity > 0 ?
            (
                <span className="badge bg-primary rounded-pill">
                    In Stock
                </span>
            )
            : (
                <span className="badge bg-primary rounded-pill">
                    Out Of Stock
                </span>
            )

    }


    return (
        <div className="card">
            <div className="card-header name">
                {product.name}
            </div>
            <div className="card-body">
                {shouldRedirect(redirect)}
                <ShowImage item={product} url="products" />
                <p className="lead mt-2">
                    {product.description.substring(0, 100)}
                </p>
                <p className="black-10">Rs. {product.price}</p>
                <p className="black-9">
                    Category: {product.category && product.category.name}
                </p>
                <p className="black-8">
                    Added {moment(product.createdAt).fromNow()}
                </p>

                {showStock(product.quantity)}

                <br />

                {showViewButton(showViewProductButton)}

                {showAddToCart(showAddToCartButton)}

                {showRemoveButton(showRemoveProductButton)}

                {showCartUpdateOptions(cartUpdate)}

            </div>
        </div >

    )
}


export default Card;