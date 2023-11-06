const Blog = require('../models/blog')
const blogRouter = require('express').Router()
const userExtractor = require('../utils/middleware').userExtractor



blogRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/', userExtractor, async (request, response, next) => {
    try {
        const body = request.body
        // console.log("🚀 ~ file: blog.js:9 ~ blogRouter.post ~ body:", body)
        const user = request.user
        // console.log("🚀 ~ file: blog.js:11 ~ blogRouter.post ~ user:", user)
        const blog = new Blog({
            title: body.title,
            url: body.url,
            author: user.name,
            user: user._id
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }

})


blogRouter.put('/:id', userExtractor, async (request, response, next) => {
    try {
        const body = request.body
        // console.log("🚀 ~ file: blog.js:42 ~ blogRouter.put ~ body:", body)

        const blog = {
            likes: body.likes
        }
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.status(200).json(updatedBlog)
    } catch (error) {
        next(error)
    }
})

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
    try {
        const user = request.user
        const blog = await Blog.findById(request.params.id)
        if (blog.user.toString() === user.id.toString()) {
            await Blog.findByIdAndDelete(request.params.id)
            user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id.toString())
            await user.save()
            response.status(204).end()
        } else {
            response.status(401).json({ error: 'Unauthorized' })
        }
    } catch (error) {
        next(error)
    }
})


module.exports = blogRouter