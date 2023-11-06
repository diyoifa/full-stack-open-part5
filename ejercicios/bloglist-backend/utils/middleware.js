const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require('../models/user')

const requestLogger = morgan((tokens, req, res) => {
    return [
        ` Method: ${tokens.method(req,res)} `,
        ` Url: ${tokens.url(req,res)} `,
        `Status: ${tokens.status(req,res)} `,
        `Response: ${tokens.res(req,res,'content-length')}`,'- ',
        ` Response-time: ${tokens['response-time'](req,res)}`,'ms ',
        `Body: ${JSON.stringify(req.body)}`
    ].join('')
})

const ERROR_HANDLERS = {
    CastError: res => res.status(400).send({error:'id used is malformed'}),
    ValidationError: (res,{message}) => res.status(409).send({error:message}),
    JsonWebTokenError: res => res.status(401).json({error:'token missing or invalid'}),
    TokenExpiredError: res => res.status(401).json({error:'token expired'}),
    defaultError: res => res.status(500).end()
}

const handleError = (error,request,response,next) => {
    const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
    handler(response,error)
    next(error)
}

const unkwonEndpoint = (request, response)=>{
    response.status(404).send({error:'unknown endpoint'})
}

const getToken = (request)=>{
        const authorization = request.get('authorization')
        if(authorization && authorization.toLowerCase().startsWith('bearer ')){
            return authorization.substring(7) 
        }
        return null
}

const userExtractor = async(request, response, next)=>{
    try {
        const token = getToken(request)
        // console.log("🚀 ~ file: middleware.js:46 ~ userExtractor ~ token:", token)
        const decodedToken = jwt.verify(token, config.SECRET)
        const user = await User.findById(decodedToken.id)
        request.user = user
        next()
    } catch (error) {
        next(error)
    }
    

}

module.exports = {
    requestLogger,
    handleError,
    unkwonEndpoint,
    userExtractor
}

