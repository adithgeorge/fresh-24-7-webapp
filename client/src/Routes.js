import React from 'react';

// For wrapping all the components, allowing props to be accessed by sub components
// These are components from react router dom
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Signup from './user/Signup';
import Signin from './user/Signin';
import Home from './core/Home';
import PrivateRoute from './auth/PrivateRoute';
import Dashboard from './user/UserDashboard';
import AdminRoute from './auth/AdminRoute';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Shop from "./core/Shop";
import Product from "./core/Product"
import Cart from "./core/Cart"
import Orders from './admin/Orders';
import Profile from './user/Profile';
import ManagedProducts from './admin/ManageProducts';
import UpdateProduct from './admin/UpdateProduct'

// Routing the different web pages
// Backend APIs are integrated with Routes
const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}></Route>
                <Route path="/shop" exact component={Shop}></Route>
                <Route path="/signup" exact component={Signup}></Route>
                <Route path="/signin" exact component={Signin}></Route>
                <PrivateRoute path="/user/dashboard" exact component={Dashboard}/>
                <AdminRoute path="/admin/dashboard" exact component={AdminDashboard}/>
                <AdminRoute path="/create/category" exact component={AddCategory}/>
                <AdminRoute path="/create/product" exact component={AddProduct}/>
                <AdminRoute path="/admin/orders" exact component={Orders}/>
                <Route path="/product/:productId" exact component={Product}></Route>
                <Route path="/cart" exact component={Cart}></Route>
                <PrivateRoute path="/profile/:userId" exact component={Profile}/>
                <AdminRoute path="/admin/products" exact component={ManagedProducts}/>
                <AdminRoute path="/admin/product/update/:productId" exact component={UpdateProduct}/>
            </Switch>
        </BrowserRouter>
    )
}

// The Routes Component return the entire application under BrowserRouter component
export default Routes;