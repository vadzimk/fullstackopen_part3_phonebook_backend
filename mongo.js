import mongoose from 'mongoose'
let showAll = false

if(process.argv.length===3){
    showAll = true
}else if (process.argv.length < 5) {
    console.log('usage: node mongo.js <passwd> <name> <number>')
    process.exit(1)
}



const pass = process.argv[2]


const url = `mongodb+srv://admin0:${pass}@cluster0.gebd2.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


if(showAll){
    showPersons()
} else{
    const name = process.argv[3]
    const number = process.argv[4]
    addPerson(name, number)
}

function showPersons(){
    Person.find({}).then(
        res=>{
            console.log("phonebook:")
            res.forEach(p=>{
                console.log(p.name, p.number)
            })
            mongoose.connection.close()
        }
    )
}

function addPerson(name, number) {
    const person = new Person(
        {
            name,
            number,
        })

    person.save().then(res => {
        console.log(`added ${res.name} number ${res.number} to phonebook`)
        mongoose.connection.close()
    }).catch(e => console.log(e))
}