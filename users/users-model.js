const db = require('../data/config-db')

module.exports = {
    add,
    find,
    findBy,
    findById,

}

function find() {
    return db('users').select('id', 'username').orderBy('id')
}

function findBy(filter) {
    return db('users').where(filter).orderBy('id')
}

async function add(user) {
    try {
        const [id] = await db('users').insert(user)
        return findById(id)
    } catch (err) {
        throw error;

    }
}

function findById(id) {
    return db('users').where({id}).first()
}