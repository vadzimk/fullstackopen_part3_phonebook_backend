import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.DB_URL
mongoose.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(err => {
        console.log("error connecting to MongDB:", err.message)
    })

const personSchema = new mongoose.Schema({
    name: {type: String, unique: true, minlength: 3},
    number: {type: String, minlength: 8},
})

personSchema.plugin(uniqueValidator)  // apply plugin to schema - adds pre-save validation for unique fields within mongoose schema.

personSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

const Person = mongoose.model("Person", personSchema)

export default Person

