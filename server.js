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
    secret: process.env.SECRET, 
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

server.get('/auth/logout', (req, res)=> {
    if (req.session && req.session.user) {
        req.session.destroy(err => {
            if (err) res.json({ message: ' you cannot leave'})
            else res.json({ message: 'good bye'})
        })
    } else { 
        res.json({ message: 'you had no session'})
    }
})


server.use('/api/users', UsersRouter)

// server.get('/', (req, res) => {
//     res.send('endpoint is working!!!')
// })

module.exports = server