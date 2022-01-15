import React, { useState, useEffect } from "react";
import { getCategories, listProducts } from "./apiCore";
import Card from "./Card";

const Search = () => {

    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    })

    const { categories, category, search, results, searched } = data

    const loadCategories = () => {

        getCategories()
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    setData({
                        ...data, categories: data
                    })
                }
            })
    }

    useEffect(() => {
        loadCategories();
    }, [])

    const searchData = () => {
        if (search) {
            listProducts({ search: search || undefined, category: category })
                .then(res => {
                    if (res.error) {
                        console.log(res.error)
                    }
                    else {
                        setData({ ...data, results: res, searched: true })
                    }
                })
        }
    }



    const searchSubmit = (e) => {

        e.preventDefault()
        searchData()

    }


    const handleChange = (name) => event => {

        setData({ ...data, [name]: event.target.value, searched: false })

    }

    const searchMessage = (searched, results) => {
        if(searched && results.length > 0)
        {
            return `Found ${results.length} products`
        }
        if(searched && results.length < 1)
        {
            return `No Products Found`
        }
    }


    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2>

                <div className="row container-fluid">
                    {results.map(
                        (product, i) => (<Card key={i} product={product} />)
                    )}
                </div>
            </div>
        )
    }



    const searchForm = () => {

        return (
            <form onSubmit={searchSubmit} >
                <span className="input-group-text">
                    <div className="input-group input-group-lg">
                        <div className="input-group-prepend">
                            <select className="btn me-3" onChange={handleChange("category")}>
                                <option value="All">All Categories</option>
                                {categories.map((c, i) => (
                                    <option key={i} value={c._id} >{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <input type="search" className="form-control" onChange={handleChange("search")} placeholder="Search products by name" />
                    </div>
                    <div className="btn input-group-append">
                        <button className="input-group-text">Search</button>
                    </div>
                </span>

            </form>
        )
    }



    return (
        <div className="row">
            <div className="container-fluid ms-0 me-0 mt-1">
                {searchForm()}
            </div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
            </div>
        </div>
    )
}

export default Search;