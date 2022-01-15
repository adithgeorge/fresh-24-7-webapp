import React, { useState } from 'react';
import Layout from '../core/Layout';
import { signin, authenticate, isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom'

const Signin = () => {

    // Form Object State
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        redirect: false
    })

    const { email, password, error, loading, redirect } = values;
    const {user} = isAuthenticated()


    const handleChange = (name, event) => {
        // Here ... operator gets us all the values fields
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });

        // We are sending a Javascript Object
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                }
                else {
                    authenticate(data, () => {
                        // Clearing out our state
                        setValues({ ...values, email: '', password: '', error: '', loading: true, redirect: true })
                    })
                }
            })
    }

    const showError = () => {
        return (
            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                {error}
            </div>
        )
    }

    const showLoading = () => {
        if (loading)
            return (
                <div className="alert alert-info">
                    <h2>
                        Loading...
                    </h2>
                </div>
            )
    }


    // If Admin we can redirect to Admin Dashboard, if normal registered user, we can redirect to User Dashboard
    const redirectUser = () => {
        if (redirect) {
            // Redirect component from react router dom
            if(user && user.role === 1)
            {
                return (
                    <Redirect to="/admin/dashboard" />
                )
            }
            else
            {
                return (
                    <Redirect to="/user/dashboard" />
                )
            }

        }

        if(isAuthenticated())
        {
            return (
                <Redirect to="/" />
            )
        }
    }

    // If we need to show JSX we need to use return to send it over
    const signUpForm = () => {
        return (
            <form className="container-fluid mt-2">
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input onChange={(e) => handleChange('email', e)} type="email" value={email} className="form-control" />
                </div>

                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input onChange={(e) => handleChange('password', e)} type="password" value={password} className="form-control" />
                </div>
                <button onClick={(e) => clickSubmit(e)} className="btn btn-primary mt-2">Submit</button>
            </form>
        );
    }

    return (
        <Layout title="Sign In" description="Sign In to E-Commerce App" className="container col-md-8 offset-md-2">
            {showLoading()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
        </Layout>
    );
}


export default Signin;