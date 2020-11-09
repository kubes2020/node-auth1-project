const express = require('express')

const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const server = express()

server.use(helmet())
server.use(morgan('dev'))
server.use(express.json())
server.use(cors())

server.get('/', (req, res) => {
    res.send('endpoint is working!!!')
})

module.exports = server