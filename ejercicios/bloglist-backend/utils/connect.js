const mongoose = require('mongoose')
const config = require('./config')
const url = config.MONGODB_URI
console.log('connecting to',url)

const connect = async()=> {
    try {
        await mongoose.connect(url)
        console.log('connected to MongoDB')
    } catch (error) {
        console.log('error connecting to MongoDB:', error.message)
        next(error)
    }
}

module.exports = connect