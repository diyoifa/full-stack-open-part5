const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator)
//siempre que se invoque el metodo toJSON se ejecutara esta funcion
//que transforma el objeto de mongoose a un objeto de js
//el meto json() llama internamente al metodo toJSON()

userSchema.set('toJSON',{
  transform:(document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id, //no retornamos en el json el id de mongo
    delete returnObject.__v, //no retornamos en el json la version de mongo
    delete returnObject.passwordHash//no retornamos en el json el password
  }
})

const User = mongoose.model('User', userSchema) //creamos el modelo

module.exports = User //exportamos el modelo