const express = require('express')
const router = express.Router()

const db = require('../config/database')
const User = require('../models/User')

const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const jwt = require('jsonwebtoken')

function findUser(req, res, next) {
    const { username, password } = req.body

    if (!username || !password) {
        const error = new Error('Missing username or password')
        error.status = 400
        return next(error)
    }

    User.findOne({ where: { username } })
        .then((user) => {
            if (!user) req.user = null
            else req.user = {
                user_id: user.user_id,
                username: user.username,
                password: user.password
            }
            next()
        })
        .catch((error) => next(error))
}

router.post('/create', findUser, async (req, res, next) => {
    if (req.user?.username) {
        const error = new Error('Username already taken')
        error.status = 409
        return next(error)
    }

    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    const hash = bcrypt.hashSync(req.body.password, salt)

    User.create({
        username: req.body.username,
        password: hash
    })
        .then((user) => {
            return res.json({ created: true })
        })
        .catch((err) => next(err))
})

router.post('/login', findUser, async (req, res, next) => {
    const correctPassword = bcrypt.compareSync(req.body.password, req.user.password)

    if (!req.user || !correctPassword) {
        const error = new Error('Invalid login')
        error.status = 403
        return next(error)
    }

    const accessToken = jwt.sign({ user_id: req.user.user_id }, process.env.ACCESS_TOKEN_SECRET)

    return res.json({
        accessToken
    })
})

module.exports = router