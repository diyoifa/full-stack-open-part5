import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  // console.log("🚀 ~ file: App.jsx:11 ~ App ~ blogs:", blogs)
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  const getBlogs = async ()=>{
    const blogs = await blogService.getAll()
      setBlogs(blogs)
  }

  useEffect(() => {
      getBlogs()
  }, [])


  //cada que actualBlogs cambie
  useEffect(() => {
    setBlogs(blogs)
  }, [blogs])


  //traer el token del localstorage
  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      console.log("🚀 ~ file: App.jsx:29 ~ useEffect ~ user:", user)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  return (
    <>
      {user === null ? (
        <LoginForm setSuccessMessage={setSuccessMessage} setUser={setUser}/>
      ) : (
        <div>

          {
            successMessage && <h1 style={{color: 'green',  border:'4px solid green', background:'lightgray'}}>{successMessage}</h1>
          }

          {
            errorMessage && <h1 style={{color: 'red', border: '4px solid red', background:'lightgray'}}>{errorMessage}</h1>
          }
         
          <h2>blogs</h2>
          <p>{user.name} logged-in</p>
          <button onClick={() => setUser(null)}>logout</button>

          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <CreateBlogForm 
              setErrorMessage={setErrorMessage} 
              setSuccessMessage={setSuccessMessage} 
              user={user}
              setBlogs={setBlogs}
              blogs={blogs}
              blogFormRef={blogFormRef}

            />
          </Togglable>

          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
            <Blog 
                key={blog.id} 
                blog={blog} 
                setBlogs={setBlogs} 
                blogs={blogs} 
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage} 
            />
                
          ))}
        </div>
      )}
    </>
  )
}

export default App