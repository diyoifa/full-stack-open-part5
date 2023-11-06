const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')


const api = supertest(app)


describe('login', () => {
  test('when we login get status 200', async() => {
    const login = {
      username: 'test',
      password: '123'
    }
    await api
      .post('/api/login')
      .send(login)
      .expect(200)
  })
  test('when we login with wrong password get status 401 and a message invalid user or password', async() => {
    const login = {
      username: 'root',
      password: 'wrong'
    }
    const response =  await api.post('/api/login').send(login).expect(401)
    expect(response.body.error).toBe('invalid user or password')
  })
})

afterAll(() => {
  mongoose.connection.close()
})