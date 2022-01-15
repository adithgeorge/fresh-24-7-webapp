import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from './apiAdmin';

const ManagedProducts = () => {

    const [products, setProducts] = useState([])

    const { user, token } = isAuthenticated()


    const loadProducts = () => {
        getProducts()
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    setProducts(data)
                }
            })
    }


    const removeProduct = (productId) => {
        deleteProduct(productId, user._id, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    loadProducts()
                }
            })

    }



    useEffect(() => {

        loadProducts();

    }, [])


    const goBack = () => {
        return (
        <div className="mt-4">
            <Link to="/admin/dashboard" className="text-warning">Back to Dashboard</Link>
        </div>
        )
    }

    return (
        <Layout title="Manage Products" description="Update and delete your existing products" className="container-fluid">
            <div className="row">
                {goBack()}
                <div className="col-12">
                    <h2 className="text-center">
                       Total {products.length} products 
                    </h2>
                    <ul className="list-group">
                        {products.map((p, i) => (

                            <li key={i}
                                className="list-group-item d-flex justify-content-between align-items-center">

                                <strong>
                                    {p.name}
                                </strong>
                                
                                <Link to={`/admin/product/update/${p._id}`} >
                                    <button className="btn bg-secondary">
                                        Update
                                    </button>
                                </Link>
                                
                                {/* A button is better */}
                                <button className="btn bg-danger"onClick={() =>  removeProduct(p._id)} >
                                    Delete
                                </button>

                            </li>
                        )
                        )}
                    </ul>
                </div>
                
            </div>

        </Layout>
    )

}

export default ManagedProducts;