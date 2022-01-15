import { API } from '../config';


const createCategory = (userId, token, category) => {
    // console.log(name, email, password);
    // We need to return then only the promise can use then
    return fetch(`${API}/category/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
        .then((response) => {
            return response.json()
        })
        .catch(err => {
            console.log(err);
        })


}


const createProduct = (userId, token, product) => {
    // console.log(name, email, password);
    // We need to return then only the promise can use then
    return fetch(`${API}/product/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: product
    })
        .then((response) => {
            return response.json()
        })
        .catch(err => {
            console.log(err);
        })

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


const listOrders = (userId, token) => {

    return fetch(`${API}/order/list/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.json();
    }).catch(err => console.log(err));

}

const getStatusValues = (userId, token) => {

    return fetch(`${API}/order/status-values/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.json();
    }).catch(err => console.log(err));

}

const updateOrderStatus = (userId, token, orderId, status) => {

    return fetch(`${API}/order/${orderId}/status/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, orderId })
    }).then(response => {
        return response.json();
    }).catch(err => console.log(err));

}

// To perform CRUD on products
// Get all products
// Get a single product
// Update a single product
// Delete a single product



const getProducts = () => {

    return fetch(`${API}/products?limit=100`, {
        method: "GET"
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

}



const deleteProduct = (productId, userId, token) => {

    return fetch(`${API}/product/${productId}/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then(response => 
        {
        return response.json();
    }
    ).catch(err => console.log(err));

}



const getProduct = (productId) => {

    return fetch(`${API}/product/${productId}`, {
        method: "GET"
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))

}



const updateProduct = (productId, userId, token, product) => {

    return fetch(`${API}/product/${productId}/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: product  // product is FORM DATA
    }).then(response => 
        {
        return response.json();
    }
    ).catch(err => console.log(err));

}



export { createCategory, createProduct, getCategories, 
    listOrders, getStatusValues, updateOrderStatus,
  getProduct, getProducts, updateProduct, deleteProduct };