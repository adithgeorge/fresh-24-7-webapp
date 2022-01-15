

const addItem = (item, next) => {
    let cart = []

    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        // When the product is added again the count in local storage should not increase but the quantity 
        // should only increase

        cart.push({
            ...item,
            count: 1
        })

        // Creating a new array using set() to get unique products
        // Removing Duplicates
        // pass the ids of each product after building a new set with unique values
        // If the loop tries to add the same value again it will get ignored
        // ...with the array of ids we got on when first map() was used
        // run map() on it again and return the actual product from the cart

        cart = Array.from(new Set(cart.map((p) => (p._id)))).map(id => {
            return cart.find(p => p._id === id)
        });

        localStorage.setItem('cart', JSON.stringify(cart))

        next();

    }
}

const itemTotal = () => {
    if (typeof window != 'undefined') {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart')).length
        }
    }

    return 0;

}


const getCart = () => {
    if (typeof window != 'undefined') {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart'))
        }
    }

    return [];

}

const updateItem = (productId, count) => {

    let cart = []

    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))

        }

        cart.map((product, i) => {
            if (product._id === productId) {
                cart[i].count = count
            }
        })

        localStorage.setItem('cart', JSON.stringify(cart))
    }


}


const removeItem = (productId) => {

    let cart = []

    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))

        }

        cart.map((product, i) => {
            if (product._id === productId) {
                // Removing from the cart
                cart.splice(i, 1)
            }
        })

        localStorage.setItem('cart', JSON.stringify(cart))
    }

    return cart

}


const emptyCart = next => {

    if(typeof window !== 'undefined')
    {
        localStorage.removeItem('cart')
        next();
    }
}




export { addItem, itemTotal, getCart, updateItem, removeItem, emptyCart};