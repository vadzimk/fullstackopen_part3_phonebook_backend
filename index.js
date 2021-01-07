import express from 'express'
// import morgan from 'morgan'
import cors from 'cors'
import Person from "./models/person.js";

// let persons = [
//     {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//     },
//     {
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523",
//         "id": 2
//     },
//     {
//         "name": "Dan Abramov",
//         "number": "12-43-234345",
//         "id": 3
//     },
//     {
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122",
//         "id": 4
//     }
// ]

const app = express()
app.use(cors())  // enables cross origin resource sharing
app.use(express.static('build'))  // GET requests are first processed from the build folder - front end part
app.use(express.json())


// morgan.token('data', (req, res)=>JSON.stringify(req.body))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// middleware is a func that has access (can modify) to req, res objects and calls next middleware at the end
// req.body is is initialized in express.json() -- body parser
const requestLogger = (req, res, next) => {
    console.log('Method', req.method)
    console.log('Path', req.path)
    console.log('Body', req.body)
    console.log('--------')
    next()
}
app.use(requestLogger)

app.get('/api/persons',
    (req, res, next) => {
        Person.find({}).then(
            persons => {
                res.json(persons.map(p=>p.toJSON))  // toJSON transforms each document in necessary way
            }).catch(err => next(err))
    })

app.get('/info',
    (req, res, next) => {
        Person.estimatedDocumentCount()
            .then(number => {
                res.send(
                    `<p>Phonebook has info for ${number} people</p>
                <p>${(new Date()).toUTCString()}</p>`
                )
            })
            .catch(err => next(err))
    })

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())  // call toJSON to transform the object
            } else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})


app.put('/api/persons/:id',
    (req, res, next) => {
        const person = {
            name: req.body.name,
            number: req.body.number
        }
        const opts = {  // object that provides options to the method findByIdAndUpdate
            new: true,  // signals to return the updated object on success
            runValidators: true // signals to run validators on update (off for update by default)
        }
        Person.findByIdAndUpdate(req.params.id, person, opts)
            .then(updatedPerson => {
                res.json(updatedPerson.toJSON())
            })
            .catch(err => next(err))
    })


app.delete('/api/persons/:id',
    (req, res, next) => {
        Person.findByIdAndRemove(req.params.id)
            .then(result => {
                if (result) {
                    res.status(204).end()
                } else {
                    res.status(404).end()
                }
            })
            .catch(err => next(err))
    })


app.post('/api/persons',
    (req, res, next) => {
        const body = req.body
        if (!body.name || !body.number) {
            res.status(400).json({error: "name and number must be specified"})
            return
        }

        const person = new Person({
            name: body.name,
            number: body.number,

        })
        person.save()
            .then(savedPerson => {
                res.json(savedPerson.toJSON()) // echos back the created contact
                // json will format the object with toJSON method.
            })
            .catch(err => next(err))
    })


const errorHandler = (error, request, response, next) => {
    console.log("error.name", error.name)
    console.log(error.message)
    if (error.name === 'CastError') {  // handles particular error if this is it
        return response.status(400).send({error: 'malformatted id'})
    }
    if (error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))

