const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
// const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  // console.log('🚀 ~ file: note.js:7 ~ notesRouter.get ~ note:', note)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if(authorization && authorization.toLowerCase().startsWith('bearer ')){
//     return authorization.substring(7)
//   }
// }

notesRouter.post('/', userExtractor,  async(request, response) => {

  // const token = getTokenFrom(request)
  // // console.log('🚀 ~ file: note.js:32 ~ notesRouter.post ~ token:', token)
  // const decodedToken = jwt.verify(token, process.env.SECRET)
  // // console.log('🚀 ~ file: note.js:34 ~ notesRouter.post ~ decodedToken:', decodedToken)

  // if(!token || !decodedToken.id){
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }

  // console.log('hasta aqui bien')

  if(!request.body.content) {
    return response.status(400).end()
  }

  const {
    content,
    important,
  } = request.body
  // console.log('🚀 ~ file: note.js:21 ~ notesRouter.post ~ body:', request.body)
  const user = await  User.findById(request.userId)
  // console.log('🚀 ~ file: note.js:22 ~ notesRouter.post ~ user:', user)

  const note = new Note({
    content,
    important,
    date: new Date(),
    user: user._id
  })
  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(200).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', async(request, response) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important,
  }
  const updatedNote =  await Note.findByIdAndUpdate(request.params.id, note, { new: true }, { runValidators: true, context: 'query' })
  response.json(updatedNote).status(200)
})

module.exports = notesRouter