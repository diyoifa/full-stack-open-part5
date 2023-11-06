const User = require('../models/user')
const Blog = require('../models/blog')

const initialUsers = [
    {
        username: 'test',
        name: 'test',
        password: 'test'
    },
    {
        username: 'test2',
        name: 'test2',
        password: 'test2'
    }
]

const blogsInDb = async()=>{
    const blogs = await Blog.find({})
    return blogs.map(blog=>blog.toJSON())
}

const usersInDb = async()=>{
    const users = await User.find({})
    return users.map(user=>user.toJSON())
}

module.exports = { initialUsers, usersInDb, blogsInDb }