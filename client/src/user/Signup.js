import React, { useState } from 'react';
import Layout from '../core/Layout';
import {signup} from '../auth';
import { Link } from 'react-router-dom'

const Signup = () => {

    // Form Object State
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    })

    const { name, email, password, error, success } = values;

    const handleChange = (name, event) => {
        // Here ... operator gets us all the values fields
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false});

        // We are sending a Javascript Object
        signup({ name, email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, success: false })
                }
                else {
                    // Clearing out our state
                    setValues({ ...values, name: '', email: '', password: '', error: '', success: true })
                }
            })
    }

    const showError = () => {
        return (
        <div className="alert alert-danger" style={{display: error ? '': 'none'}}>
            {error}
        </div>
        )
    }

    const showSuccess = () => {
        return(
        <div className="alert alert-info" style={{display: success ? '': 'none'}}>
            New Account is Created. Please <Link to="/signin">Signin</Link>
        </div>
        )
    }




    // If we need to show JSX we need to use return to send it over
    const signUpForm = () => {
        return (
            <form className="container-fluid mt-2">
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input onChange={(e) => handleChange('name', e)} type="text" value={name} className="form-control" />
                </div>

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
        <Layout title="Sign Up" description="Sign Up to E-Commerce App" className="container col-md-8 offset-md-2">
            {showSuccess()}
            {showError()}
            {signUpForm()}
        </Layout>
    );
}


export default Signup;