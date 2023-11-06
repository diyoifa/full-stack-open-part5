const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  // logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const ERROR_HANDLERS = {
  CastError: res => res.status(400).send({ error: 'id used is malformed' }),
  ValidationError: (res, { message }) => res.status(409).send({ error: message }),
  JsonWebTokenError: res => res.status(401).json({ error: 'token missing or invalid' }),
  TokenExpiredError: res => res.status(401).json({ error: 'token expired' }),
  defaultError: res => res.status(500).end()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  // if (error.name === 'CastError') {
  //   return response.status(400).send({ error: 'malformatted id' })
  // } else if (error.name === 'ValidationError') {
  //   return response.status(400).json({ error: error.message })
  // } else if (error.name === 'TokenExpiredError') {
  //   return response.status(401).json({
  //     error: 'token expired'
  //   })
  // } else if (error.name ===  'JsonWebTokenError') {
  //   return response.status(400).json({ error: error.message })
  // }
  handler(response, error)
  next(error)
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
}

const userExtractor = (request, response, next) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  request.userId = decodedToken.id
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor
}