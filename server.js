const express = require('express')
const bcrypt = require('bcryptjs')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const UsersRouter = require('./users/users-router.js')
const Users = require('./users/users-model.js')
const session = require('express-session')


const server = express()

server.use(helmet())
server.use(morgan('dev'))
server.use(express.json())
server.use(cors())
server.use(session({  
    name: 'monkey',
    secret: 'this is secret', 
    cookie: {
        maxAge: 1000 * 20, 
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,

}))

server.post('/auth/register', async (req, res) => {
    try {
    const { username, password } = req.body

    const hash = bcrypt.hashSync(password, 10) 
    const user = { username, password: hash, role: 2 }
    const addedUser = await Users.add(user)
    res.json(addedUser)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

server.post('/auth/login', async (req, res) => {
    try {
        const [user] = await Users.findBy({ username: req.body.username})
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = user
            res.json({ message: `welcome back ${user.username}`})
        }
    } catch (err) {
        res.status(500).json({message: err.message })
    }
})


server.use('/api/users', UsersRouter)

// server.get('/', (req, res) => {
//     res.send('endpoint is working!!!')
// })

module.exports = server