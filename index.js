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
    (req, res) => {
        Person.find({}).then(
            persons => {
                res.json(persons)
            }).catch(err => {
            console.log('error find all persons', err)
        })
    })

app.get('/info',
    (req, res) => {
        res.send(
            `<p>Phonebook has info for ${persons.length} people</p>
                <p>${(new Date()).toUTCString()}</p>`
        )
    })

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find((p) => p.id === id)


    if (!person) {
        res.status(404).end()
        return  // necessary to exit from the callback
    }
    res.send(person)
})

app.delete('/api/persons/:id',
    (req, res, next) => {

    Person.findByIdAndRemove(req.params.id)
        .then(result=>{
            if(result){
                res.status(204).end()
            } else{
                res.status(404).end()
            }
        })
        .catch(err=>next(err))
})

// const generateId = () => Math.max(...persons.map(p => p.id)) + 1
const generateRandomId = () => {
    let id
    do {
        id = Math.floor(Math.random() * (Math.pow(10, 20) - 1) + 1)
    }
    while (persons.find(p => p.id === id))
    return id
}

app.post('/api/persons',
    (req, res,next) => {
    const body = req.body
    if (!body.name || !body.number) {
        res.status(400).json({error: "name and number must be specified"})
        return
    }

    // if (persons.filter(p => p.name === req.body.name).length) {
    //     res.status(400).json({error: "name must be unique"})
    //     return
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
        // id: generateRandomId()
    })
    person.save()
        .then(savedPerson => {
            res.json(savedPerson) // echos back the created contact
            // json will format the object with toJSON method.
        })
        .catch(err => next(err))


})



const errorHandler = (error, request, response, next)=>{
    console.log(error.message)
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))

