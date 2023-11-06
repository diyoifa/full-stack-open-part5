const app = require('../app')
const sueprTest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')

const api = sueprTest(app)

describe('login', ()=>{
    test('login with correct credentials', async()=>{
        const user = helper.initialUsers[0]
        const credentials = {
            username: user.username,
            password: user.password
        }
        const response = await api.post('/api/login').send(credentials).expect(200).expect('Content-Type', /application\/json/)
        console.log(response.body)
        expect(response.body.token).toBeDefined()
    })
    test('login with incorrect credentials', async()=>{
        const user = helper.initialUsers[0]
        const credentials = {
            username: user.username,
            password: 'incorrectPassword'
        }
        const response = await api.post('/api/login').send(credentials).expect(401).expect('Content-Type', /application\/json/)
        console.log(response.body)
        expect(response.body.error).toBeDefined()
    })
})


afterAll(()=>mongoose.connection.close())