import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './index';

// Privates Routes in React Router Dom, it accepts components and does the routing
// Check the react router documentation

// PrivateRoute restricts the authenticated user only to access some web pages

const AdminRoute = ({ component: Component, ...rest }) => {
    // Checking if the user is authenticated and also the admin as well
    return (
        <Route {...rest} render={props => isAuthenticated() && isAuthenticated().user.role === 1 ? (
            <Component {...props} />
        ) : (
            <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
        )} />
    )

}


export default AdminRoute;