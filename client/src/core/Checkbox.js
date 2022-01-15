import React, {useState} from 'react';

const Checkbox = ({categories, handleFilters}) => {

    const [checked, setChecked] = useState([])

    // Higher Order Function getting the id of the category

    const handleToggle = c => () => {

        // return the first index or -1
        const currentCategoryId = checked.indexOf(c); 

        const newCheckedCategoryId = [...checked]

        // if currently checked was not already in checked state then we push
        // else pull/ take off

        if(currentCategoryId === -1)
        {
            newCheckedCategoryId.push(c)
        }
        else
        {   
            // We are taking off the unchecked item
            newCheckedCategoryId.splice(currentCategoryId, 1)
        }

        // console.log(newCheckedCategoryId)
        setChecked(newCheckedCategoryId)
        // Passing to the parent
        handleFilters(newCheckedCategoryId)
    }

    return categories.map((c, i) => 
    (
        <li key={i} className="list-unstyled">
            <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id) === -1} type="checkbox" className="form-check-input" />
            <label className="form-check-label ms-1">{c.name}</label>
        </li> 
    ))
}


export default Checkbox;