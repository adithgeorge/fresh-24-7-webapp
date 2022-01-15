import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { getProduct, getCategories, updateProduct } from './apiAdmin';
import { Link, Redirect } from 'react-router-dom'

const UpdateProduct = ({ match }) => {


    // Our State
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        delivery: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })

    const { user, token } = isAuthenticated()

    // Destructure our state
    const {
        name,
        description,
        price,
        categories,
        category,
        delivery,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values


    // Load Categories and set form data

    const init = (productId) => {
        
        getProduct(productId)
        .then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error})
            }
            else
            {
                // Populate the state with information of single product

                setValues({...values, 
                    name: data.name, 
                    description: data.description, 
                    price: data.price,
                    category: data.category._id,
                    shipping: data.shipping,
                    quantity: data.quantity,
                    formData: new FormData()
                    })

                // Load categories
                initCategories()
            }
        })

    }



    const initCategories = () => {
        getCategories()
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error })
                }
                else {
                    setValues({ categories: data, formData: new FormData() })
                }
            })
    }


    // This method runs when the component mounts and anytime the values change
    // We have to understand more about mounting and use effect
    useEffect(() => {
        init(match.params.productId);
    }, [])



    const handleChange = (name, event) => {

        const value = name === 'photo' ? event.target.files[0] : event.target.value

        // Setting the value in form
        formData.set(name, value)

        // Setting the values from form in state 
        setValues({ ...values, [name]: value })

    }

    const clickSubmit = (event) => {

        event.preventDefault();
        setValues({ ...values, error: '', loading: true });

        updateProduct(match.params.productId, user._id, token, formData)
            .then(
                data => {
                    if (data.error) {
                        setValues({ ...values, error: data.error })
                    }
                    else {
                        setValues({
                            ...values, 
                            name: '', 
                            description: '', 
                            photo: '', 
                            price: '', 
                            quantity: '', 
                            loading: false, 
                            error: false, 
                            redirectToProfile: true,
                            createdProduct: data.name
                        })
                    }
                }
            )

    }



    const newPostForm = () => {
        return (
            <form className="mb-3 mt-2" onSubmit={clickSubmit}>
                <h4>Post Photo</h4>
                <div className="form-group">
                    <label className="btn btn-secondary">
                        <input onChange={(e) => handleChange('photo', e)} type="file" name="photo" accept="image/*"></input>
                    </label>
                </div>

                <div className="form-group">    
                    <label className="text-muted">Name</label>
                    <input onChange={(e) => handleChange('name', e)} type="text" className="form-control" value={name}></input>
                </div>

                <div className="form-group">
                    <label className="text-muted">Description</label>
                    <textarea onChange={(e) => handleChange('description', e)} className="form-control" value={description} />
                </div>

                <div className="form-group">
                    <label className="text-muted">Price</label>
                    <input onChange={(e) => handleChange('price', e)} type="number" className="form-control" value={price}></input>
                </div>

                <div className="form-group">
                    <label className="text-muted">Category</label>
                    <select onChange={(e) => handleChange('category', e)} className="form-control" >
                        <option>Please select a category</option>
                        {/* Listing out the entire categories available */}
                        {categories && categories.map((cat, i) => (
                            <option key={i} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="form-group">
                    <label className="text-muted">Delivery</label>
                    <select onChange={(e) => handleChange('delivery', e)} className="form-control" >
                        <option>Please select delivery option</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>


                <div className="form-group">
                    <label className="text-muted">Quantity</label>
                    <input onChange={(e) => handleChange('quantity', e)} type="number" className="form-control" value={quantity}></input>
                </div>

                <button className="btn btn-outline-primary mt-3">
                    Update Product
                </button>


            </form>
        );

    }

    const showError = () => {
        return (
            <div className="alert alert-danger" style={{display: error ? '': 'none'}}>
                {error}
            </div>
        )
    }

    // If success also had a state then, we could have done the showSuccess and showError in the other way as
    // we did for categories
    const showSuccess = () => {
        return (
            <div className="alert alert-info" style={{display: createdProduct ? '': 'none'}}>
                <h2>
                    {`${createdProduct}`} is updated!
                </h2>
            </div>
        )
    }

    const showLoading = () => {
        if (loading)
        {
            return (
            <div className="alert alert-success">
                <h2>
                    Loading...
                </h2>
            </div>
        )
        }

    }

    const redirectUser = () => {
        if(redirectToProfile)
        {
            if(!error)
            {
                return <Redirect to="/" />
            }
        }
    }


    const goBack = () => {
        return (
        <div className="mt-4">
            <Link to="/admin/dashboard" className="text-warning">Back to Dashboard</Link>
        </div>
        )
    }

    
    // Sometimes the request we are sending becomes OPTIONS instead of POST, we need to fix that
    return (
        <Layout title="Add New Product" description={`Add new product below.`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                    {redirectUser()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    );

}


export default UpdateProduct;