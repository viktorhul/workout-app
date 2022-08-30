const express = require('express')
const router = express.Router()

const db = require('../config/database')
const Exercise = require('../models/Exercise')


// TODO: complete auth function
function auth(req, res, next) {
    //console.log(req.headers.authorization)
    next()
}

// get all exercises
router.get('/', (req, res, next) => {
    Exercise.findAll()
        .then((exercises) => {
            res.json({ ok: true, exercises })
        })
        .catch((err) => {
            return next(err)
        })
})

router.post('/', auth, (req, res, next) => {
    const { exercise_name, comment } = req.body

    if (!exercise_name || !comment) {
        const err = new Error('Missing exercise_name or comment')
        err.status = 400
        return next(err)
    }

    Exercise.create({
        exercise_name,
        comment,
        lastCompleted: new Date()
    })
        .then((exercise) => res.json({ ok: true, exercise }))
        .catch(err => next(err))
})

module.exports = router
