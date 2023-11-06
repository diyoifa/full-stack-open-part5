const app = require('../app.js')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const api = supertest(app)

let token = null

beforeAll(async()=>{
    await Blog.deleteMany({})
    await User.deleteMany({})

    for(const user of helper.initialUsers){
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(user.password, saltRounds)
        const userObject = new User({
            username: user.username,
            name: user.name,
            passwordHash
        })
        await userObject.save()
    }

    const user  = helper.initialUsers[0]
    const credentials = {
        username: user.username,
        password: user.password
    }
    const response = await api.post('/api/login').send(credentials)
    token = response.body.token
},100000)

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type',/application\/json/)
    })
})


describe('when creating a new blog',()=>{
    test('a new blog is created succesfully return status 201 and json', async()=>{
        const newBlog = {
            title: 'testx',
            url: 'localhost:3003',
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type',/application\/json/)
    })
    test('a new blos is created without token return status 401', async()=>{
        const newBlog = {
            title: 'testz',
            url: 'localhost:3003',
        }
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer `)
            .expect(401)
        expect(response.body.error).toBe('token missing or invalid')
    })
})

describe('when updating a blog',()=>{
    
    test('a blog is updated succesfully return status 200 and json', async()=>{
        
        const newBlog = {
            title: 'test',
            url: 'localhost:3003',
        }
        const response = await api
            .post('/api/blogs/')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
        const updatedBlog = { likes: 11 }
        // console.log(response.body.id)

        await api
            .put(`/api/blogs/${response.body.id}`)
            .send(updatedBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type',/application\/json/)
    })
    test('a blog is updated without token return status 401', async()=>{
        const newBlog = {
            title: 'test',
            url: 'localhost:3003',
        }
        const response = await api
            .post('/api/blogs/')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
        const updatedBlog = { likes: 11 }

        await api
            .put(`/api/blogs/${response.body.id}`)
            .send(updatedBlog)
            .set('Authorization', `bearer `)
            .expect(401)

    })
})


describe('when deleting a blog',()=>{
    test('a blog is deleted succesfully return status 204', async()=>{
        const newBlog = {
            title: 'testy',
            url: 'localhost:3003',
        }
        const response = await api
            .post('/api/blogs/')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
        await api
            .delete(`/api/blogs/${response.body.id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204)
    })
    test('a blog is deleted without token return status 401', async()=>{
        const newBlog = {
            title: 'testyy',
            url: 'localhost:3003',
        }
        const response = await api
            .post('/api/blogs/')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
        await api
            .delete(`/api/blogs/${response.body.id}`)
            .set('Authorization', `bearer `)
            .expect(401)
    })
})


afterAll(() => mongoose.connection.close())