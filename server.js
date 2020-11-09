const express = require('express')
const bcrypt = require('bcryptjs')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const UsersRouter = require('./users/users-router.js')
const Users = require('./users/users-model.js')


const server = express()

server.use(helmet())
server.use(morgan('dev'))
server.use(express.json())
server.use(cors())

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

server.use('/api/users', UsersRouter)

// server.get('/', (req, res) => {
//     res.send('endpoint is working!!!')
// })

module.exports = server