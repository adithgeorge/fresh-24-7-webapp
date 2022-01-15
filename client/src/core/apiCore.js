import { API } from '../config';
import queryString from 'query-string';

//  Getting Products based on sorting
const getProducts = (sortBy) => {

    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

}

const getCategories = () => {

    return fetch(`${API}/categories`, {
        method: "GET"
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

}

const getFilteredProducts = (skip, limit, filters = {}) => {

    const data = {
        limit, skip, filters
    }

    return fetch(`${API}/products/by/search`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            return response.json()
        })
        .catch(err => {
            console.log(err);
        })

}

const listProducts = (params) => {

    const query = queryString.stringify(params)
    console.log('query', query)
    return fetch(`${API}/products/search?${query}`, {
        method: "GET"
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

}


const readProduct = (productId) => {

    return fetch(`${API}/product/${productId}`, {
        method: "GET"
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

}


const listRelatedProducts = (productId) => {

    return fetch(`${API}/products/related/${productId}`, {
        method: "GET"
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

}


const getBrainTreeClientToken = (userId, token) => {

    return fetch(`${API}/braintree/getToken/${userId}`, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

}


const processPayment = (userId, token, paymentData) => {

    return fetch(`${API}/braintree/payment/${userId}`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

}


const createOrder = (userId, token, createOrderData) => {

    return fetch(`${API}/order/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: createOrderData })
    }).then(res => {
        
        return res.json()
        
    }).catch(err => console.log(err))

}




export {
    getProducts, getCategories, getFilteredProducts,
    listProducts, readProduct, listRelatedProducts,
    getBrainTreeClientToken, processPayment, createOrder
}