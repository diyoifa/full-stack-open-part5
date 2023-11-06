const express = require('express')
const cors = require('cors')
const connect = require('./utils/connect')
const middleware = require('./utils/middleware')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const blogRouter = require('./controllers/blog')
const app = express()

connect()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

//controllers
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogRouter)

if(process.env.NODE_ENV === 'test'){
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unkwonEndpoint)
app.use(middleware.handleError)

module.exports = app
