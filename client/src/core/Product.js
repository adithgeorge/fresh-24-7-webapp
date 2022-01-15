
import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { readProduct, listRelatedProducts } from "./apiCore";
import Card from "./Card";

const Product = (props) => {

    const [product, setProduct] = useState({})
    const [relatedProduct, setRelatedProduct] = useState([])
    const [error, setError] = useState(false)

    const loadSingleProduct = productId => {

        readProduct(productId)
            .then(data => {
                if (data.error) {
                    setError(data.error)
                }
                else {
                    setProduct(data)

                    // After Loading Single Product then we can fetch related products

                    listRelatedProducts(data._id)
                        .then(data => {
                            if (data.error) {
                                setError(data.error)
                            }
                            else {
                                setRelatedProduct(data)
                            }
                        })
                }
            })

    }

    // We have to change the state whenever there is a change in the query paramater ie. productId
    useEffect(() => {
        // Here we get the props as we are using react router dom and getting the URL from product ID

        const productId = props.match.params.productId
        loadSingleProduct(productId)

    }, [props])

    return (
        <Layout
            title={product && product.name}
            description={product && product.description && product.description.substring(0, 100)}
            className="container-fluid">

            <div className="row mt-3">
                <div className="col-8">
                    {
                        product && product.description &&
                        <div className="col-5 mb-3">
                            <Card product={product} showViewProductButton={false} />
                        </div>
                    }
                </div>
                <div className="col-4">
                    <h4>
                        Related Products
                    </h4>
                    {relatedProduct.map((product, i) => (
                        <div className="mb-3">
                            <Card key={i} product={product}/>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}


export default Product;