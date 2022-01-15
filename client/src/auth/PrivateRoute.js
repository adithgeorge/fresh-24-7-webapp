import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './index';

// Privates Routes in React Router Dom, it accepts components and does the routing
// Check the react router documentation

// PrivateRoute restricts the authenticated user only to access some web pages

const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        <Route {...rest} render={props => isAuthenticated() ? (
            <Component {...props} />
        ) : (
            <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
        )} />
    )

}


export default PrivateRoute;