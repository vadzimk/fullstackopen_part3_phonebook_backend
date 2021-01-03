import express from 'express'

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

const PORT = 3001
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))

