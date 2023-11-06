import {useState } from "react"
import blogServices from "../services/blogs"

const Blog = ({ blog, setBlogs, blogs, setSuccessMessage, setErrorMessage }) => { 
  const [showDetails, setShowDetails] = useState(false)
  const {likes} = blog
  // console.log("🚀 ~ file: Blog.jsx:7 ~ Blog ~ likes:", likes)
  const [newLikes, setNewLikes] = useState( likes || 0)


  const handleLike = async()=> {
    try {
      setNewLikes(newLikes + 1)
    // console.log("🚀 ~ file: Blog.jsx:13 ~ handleLike ~ newLikes", newLikes)
      await blogServices.update(blog.id, {likes: newLikes})

    } catch (error) {
      console.log("🚀 ~ file: Blog.jsx:17 ~ handleLike ~ error:", error)
    }
  }

  const handleRemove = async()=> {
    try {
        if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
          await blogServices.remove(blog.id)
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setSuccessMessage(`Blog ${blog.title} was removed`)
          setTimeout(()=>{
            setSuccessMessage(null)
          }, 5000)
        }
        
    } catch (error) {
    //  console.log("🚀 ~ file: Blog.jsx:25 ~ handleRemove ~ error", error)
     setErrorMessage(`Blog ${blog.title} could not be removed`) 
     setTimeout(()=>{
      setErrorMessage(null)
     }, 5000)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginTop: "5px",
    marginBottom: 5

  }

  const handleShowDetails = () => setShowDetails(!showDetails)

  const detailsStyle = {
    display: showDetails ? "" : "none",
    border: "1px solid black",
    padding: "10px",
    marginTop: "5px",
    marginBottom: "5px"
  }

  const removeButtonStyle = {
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px",
    cursor: "pointer",
    marginTop: "5px",
    marginBottom: "5px"
  }

  return(
    <div>
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button style={{marginLeft:"12px"}}  onClick={handleShowDetails}>{showDetails ? "hide" : "view"}</button>
      </div>
      <div style={detailsStyle} className="togglableContent">
        <p>{blog.url}</p>
        <p>
          <span> {newLikes} likes </span>  
          <button onClick={handleLike}>like</button>
        </p>
        <p>{blog.author}</p>
        <button style={removeButtonStyle} onClick={handleRemove}>remove</button>
      </div>
    </div> 
  )
}

export default Blog