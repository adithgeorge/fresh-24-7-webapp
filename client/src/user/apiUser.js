
import { API } from '../config';

const readUser = (userId, token) => {

    return fetch(`${API}/user/${userId}`, {
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



const updateUser = (userId, token, user) => {

    return fetch(`${API}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    }).then(res => {
        
        return res.json()
        
    }).catch(err => console.log(err))

}


const updateUserLocal = (user, next) => {

    if(typeof window !== 'undefined')
    {
        if(localStorage.getItem('jwt'))
        {
            let auth = JSON.parse(localStorage.getItem('jwt'))
            auth.user = user

            localStorage.setItem('jwt', JSON.stringify(auth))

            next();

        }
    }

}


const getPurchaseHistory = (userId, token) => {

    return fetch(`${API}/orders/by/user/${userId}`, {
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





export  { readUser, updateUser, updateUserLocal, getPurchaseHistory }