import React from 'react'
import blogServices from '../services/blogs'
import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlogForm = ({setErrorMessage, setSuccessMessage, user, setBlogs, blogs, blogFormRef}) => {
    const [blog, setBlog] = useState({})

    const onSubmit = async(event) => {
        event.preventDefault()
        try {
            const blogAdded = await blogServices.create(blog)
            setBlogs(blogs.concat(blogAdded))
            setSuccessMessage(`a new blog ${blog.title} by ${user.name} added`)
            blogFormRef.current.toggleVisibility()
            setTimeout(() => {
                setSuccessMessage(null)
            },5000)
        } catch (error) {
            console.log(error)
            setErrorMessage('Error: ' + error.response.data.error)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);
        }
    }

    const handleChange = (event) => {
        setBlog({
            ...blog,
            [event.target.name]: event.target.value
        })
    }


  return (
    <div>
      <h1>Create New</h1>
      <form onSubmit={onSubmit}>
        <div>
            <label>Title: 
                <input
                    id='title' 
                    type='text' 
                    name='title' 
                    onChange={handleChange}
                    required
                />
            </label>
        </div>
        <div>
            <label>Url: 
                <input
                    id='url' 
                    type='text' 
                    name='url' 
                    onChange={handleChange}
                    required
                />
            </label>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

CreateBlogForm.propTypes = {
    setErrorMessage: PropTypes.func.isRequired,
    setSuccessMessage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    setBlogs: PropTypes.func.isRequired,
    blogs: PropTypes.array.isRequired,
    blogFormRef: PropTypes.object.isRequired
}

export default CreateBlogForm
