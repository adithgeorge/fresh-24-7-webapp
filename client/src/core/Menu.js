import React, { Fragment } from 'react';
// Link Component is similar to href, but I think more functionalities and easier to implement
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth'
import { itemTotal } from './cartHelpers';


// For Highlighting our Nav Bar

// I think these components have helper functions/ modules for accessing props and these props are then passed
// to sub components

// You can get access to the history object's properties by using <withRouter> as mentioned
// These props are coming from the react-router-dom as we are using the withRouter

const isActive = (history, path) => {

    if (history.location.pathname === path) {
        return { color: '#ff9900' }
    }
    else {
        return { color: '#ffffff' }
    }

}


const Menu = ({ history }) => {
    return (
        <div>
            <ul className="nav nav-tabs bg-dark" >
                <li className="nav-item ">
                    <Link className="nav-link" style={isActive(history, '/')} to="/">Home</Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/shop')} to="/shop">Shop</Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/cart')} to="/cart">
                        Cart <sup><small className="cart-badge badge">{itemTotal()}</small></sup>
                    </Link>
                </li>


                {/* If it is authenticated and standard user, show user dashboard endpoint or route */}
                {isAuthenticated() && isAuthenticated().user.role === 0 &&
                    (<li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/user/dashboard')} to="/user/dashboard">Dashboard</Link>
                    </li>)
                }

                {/* A bug is there where the admin can access the user dashboard, we may need to fix that */}
                {/* If it is authenticated and admin user, show admin dashboard endpoint or route */}
                {isAuthenticated() && isAuthenticated().user.role === 1 &&
                    (<li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/admin/dashboard')} to="/admin/dashboard">Dashboard</Link>
                    </li>)
                }

                {/* shows signin and signup if not signed in else does not show */}
                {/* Fragment does not mess up our styling as it is not div */}

                {!isAuthenticated() && (
                    <Fragment>
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">SignIn</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">SignUp</Link>
                        </li>
                    </Fragment>
                )}


                {/* Signout Option, shows only when user is signed in, is redirecte to home when we signout*/}

                {isAuthenticated() && (
                    <Fragment>
                        <li className="nav-item">
                            <span className="nav-link text-muted" style={{ cursor: 'pointer', color: 'ffffff' }} onClick={() => signout(() => {
                                history.push("/")
                            })}>SignOut</span>
                        </li>
                    </Fragment>
                )}

            </ul>
        </div>
    )
}

// why exporting withRouter

export default withRouter(Menu);