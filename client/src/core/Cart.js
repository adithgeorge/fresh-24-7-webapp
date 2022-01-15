import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Card from './Card';
import { getCart} from "./cartHelpers"
import { Link } from 'react-router-dom';
import Checkout from "./Checkout"


const Cart = () => {

    const [items, setItems] = useState([])
    const [run, setRun] = useState(false)

    // Whenever there is a change in the items, the useEffect runs

    useEffect(() => {

        setItems(getCart())

    }, [run])


    const showItems = items => {

        return (
            <div>
                <h2>
                    Your cart has {`${items.length}`} items
                </h2>

                <hr />

                {items.map((product, i) =>
                (
                    <Card key={i} 
                    product={product} 
                    showAddToCartButton={false} 
                    cartUpdate={true} 
                    showRemoveProductButton={true}
                    setRun={setRun}
                    run={run} />
                ))}

            </div>
        )
    }


    const noItemsMessage = () => {
        return (
            <h2>
                Your cart is empty.
                <br />
                <Link to="/shop">
                    Continue Shopping
                </Link>
            </h2>
        )
    }



    return (
        <Layout title="Shopping Cart"
            description="Manage your cart items. Add, Remove, Checkout or continue shopping"
            className="container-fluid">
            
            <div className="row mt-2">
                <div className="col-8">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>

                <div className="col-4">

                    <h2 className="mb-3">
                        Cart Summary
                    </h2>
                    <hr />

                    {/* Set Run required to render the parent Cart */}
                    <Checkout products={items} setRun={setRun} run={run} />
                </div>

            </div>

        </Layout>

    )
}


export default Cart;