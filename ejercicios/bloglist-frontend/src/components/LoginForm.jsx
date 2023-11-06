import React from 'react'
import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const LoginForm = ({setSuccessMessage, setUser}) => {
    const [credentials, setCredentials] = useState({})
    const [errorMessage, setErrorMessage] = useState(null)

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
        // console.log('submiting', credentials)
            const user  =  await loginService.login(credentials)
            // console.log("🚀 ~ file: LoginForm.jsx:21 ~ handleSubmit ~ user:", user)
            //guardar el usuario en el localstorage
            window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
            setUser(user)
            blogService.setToken(user.token)
            setSuccessMessage('Login success')
            setTimeout(() => {
                setSuccessMessage(null)
            }, 5000);
        } catch (error) {
            console.log("🚀 ~ file: LoginForm.jsx:28 ~ handleSubmit ~ error:", error)
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000)
        }

    }


  return (
    <div>
         {
            errorMessage && <h1 style={{color: 'red', border: '4px solid red', background:'lightgray'}}>{errorMessage}</h1>
          }
        <h2>Login</h2>
      <form id='login-form' onSubmit={handleSubmit}>
        <div>
            <label>Username : 
                <input
                    type='text'
                    name='username'
                    placeholder='username'
                    required
                    onChange={handleChange}
                />
            </label>
        </div>
        <div>
            <label>password : 
                <input 
                    type='password'
                    name='password'
                    placeholder='password'
                    required
                    onChange={handleChange}
                />
            </label>
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
    setSuccessMessage: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired
  }

export default LoginForm
