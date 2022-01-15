import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { readUser, updateUser, updateUserLocal } from './apiUser'
import {  Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Profile = ({ match }) => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: false,
        success: false
    })


    const { token } = isAuthenticated()

    const { name, email, password, error, success } = values

    const init = (userId) => {

        // console.log(userId)
        readUser(userId, token)
        .then(data => {
            if(data.error)
            {
                setValues({...values, error: true})
            }
            else
            {
                setValues({...values, name: data.name, email: data.email})
            }


        })


    }

    useEffect(() => {
        init( match.params.userId );
    }, [])


    const handleChange = name => e => {

        setValues({...values, error: false, [name] : e.target.value})

    }        

    const clickSubmit = (e) => {

        e.preventDefault()

        updateUser(match.params.userId, token, {name, email, password})
        .then(data => {
            if(data.error)
            {
                console.log(data.error)
            }
            else
            {
                updateUserLocal(data, () => {
                    setValues({...values, name: data.name, email: data.email, success: true})
                })
            }
        })


    }


    const redirectUser = (success) => {

        if(success)
        {
            return <Redirect to="/cart"/>
        }

    }


    const profileUpdate = (name, email, password) => {

        return (
            <form className="container-fluid">
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type="text" 
                    onChange={handleChange('name')} 
                    className="form-control"
                    value = {name} />

                </div>

                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input type="email" 
                    onChange={handleChange('email')} 
                    className="form-control"
                    value = {email} />
                    
                </div>

                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input type="password" 
                    onChange={handleChange('password')} 
                    className="form-control"
                    value = {password} />
                    
                </div>

                <button className="btn btn-primary mt-2" onClick={clickSubmit}>
                    Submit
                </button>


            </form>
        )

    }

    const goBack = () => {
        return (
        <div className="mt-5">
            <Link to="/user/dashboard" className="text-warning">Back to Dashboard</Link>
        </div>
        )
    }

    return (
        <Layout title="Profile" description="Edit your profile" className="container-fluid">

            <h2 className="mb-4 mt-2">
                Profile Update
            </h2>

            {profileUpdate(name, email, password)}
            {redirectUser(success)}
            {goBack()}
        </Layout>
    )

}


export default Profile;