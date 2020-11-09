const router = require('express').Router()

const Users = require('./users-model.js')

function secure(req, res, next) {
    if (req.session && req.session.user){
        next()
    } else {
        res.status(401).json({ message: 'unauthorized' })
    }
}

router.get('/', secure, (req, res)=> {
    Users.find()
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json({ message: err.message })
    })
})

module.exports = router