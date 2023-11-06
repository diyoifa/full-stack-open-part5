const User = require('../models/user')
const Note = require('../models/note')
const testingRouter = require('express').Router()

testingRouter.post('/reset', async(request, response) => {
  await User.deleteMany({})
  await Note.deleteMany({})
  response.status(204).end()
})
module.exports = testingRouter