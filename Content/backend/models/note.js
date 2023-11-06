const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
  user: {
    //referencia al usuario que creo la nota
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
//evitar duplicados
noteSchema.plugin(uniqueValidator)

//formatear la salida del json para que no se muestre el _id y el __v y se muestre el id en su lugar
noteSchema.set('toJSON', {
  transform: (_,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)