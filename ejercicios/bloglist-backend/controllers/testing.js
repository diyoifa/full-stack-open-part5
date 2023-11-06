const User = require('../models/user')
const Blog = require('../models/blog')
const testingRouter = require('express').Router()


testingRouter.post('/reset', async(request, response)=>{
    await User.deleteMany({})
    await Blog.deleteMany({})
    response.status(204).end()
})

module.exports = testingRouter