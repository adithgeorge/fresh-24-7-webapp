import { API } from '../config';


const signup = (user) => {
    // console.log(name, email, password);
    // We need to return then only the promise can use then
    return fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then((response) => {
            return response.json()
        })
        .catch(err => {
            console.log(err);
        })


}


const signin = (user) => {
    // console.log(name, email, password);
    // We need to return then only the promise can use then
    return fetch(`${API}/signin`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then((response) => {
            return response.json()
        })
        .catch(err => {
            console.log(err);
        })


}


const authenticate = (data, next) => {
    // Checking if we have the window object in browser, otherwise we will not have the local storage
    if(typeof window !== 'undefined')
    {
        localStorage.setItem('jwt', JSON.stringify(data));
        next();
    }
}


const signout = (next) => {

    if(typeof window !== 'undefined')
    {
        localStorage.removeItem('jwt');
        next();
        return fetch(`${API}/signout`,
        {
            method: "GET"
        })
        .then(response => console.log("Signout"))
        .catch(err => console.log(err))
    }

}


const isAuthenticated = () => {
    if(typeof window === 'undefined')
    {
        return false
    }

    if(localStorage.getItem('jwt'))
    {
        return JSON.parse(localStorage.getItem('jwt'))
    }
    else
    {
        return false;
    }
}



export {signup, signin, authenticate, signout, isAuthenticated};