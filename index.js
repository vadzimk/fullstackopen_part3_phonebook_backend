import express from 'express'
import morgan from 'morgan'

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

const app = express()
app.use(express.json())

morgan.token('data', (req, res)=>JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons',
    (req, res) => {
        res.json(persons)
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

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

// const generateId = () => Math.max(...persons.map(p => p.id)) + 1
const generateRandomId =()=>{
    let id
    do {
        id = Math.floor(Math.random() * (Math.pow(10, 20)-1)+1)
    }
    while(persons.find(p=>p.id===id))
    return id
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        res.status(400).json({error: "name and number must be specified"})
        return
    }

    if(persons.filter(p=>p.name===req.body.name).length){
        res.status(400).json({error: "name must be unique"})
        return
    }

    const newContact = {
        name: body.name,
        number: body.number,
        id: generateRandomId()
    }
    persons = persons.concat(newContact)
    res.json(newContact) // echos back the created contact
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))

