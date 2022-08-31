const express = require('express')
const sequelize = require('sequelize')
const router = express.Router()

const db = require('../config/database')
const Exercise = require('../models/Exercise')
const ExercisePlan = require('../models/ExercisePlan')
const Workout = require('../models/Workout')
const WorkoutExercise = require('../models/WorkoutExercise')

router.get('/plans', (req, res, next) => {
    ExercisePlan.findAll({
        where: {
            user_id: req.user_id
        }
    })
        .then((exercises) => {
            res.json({ ok: true, data: exercises.map(e => ({ exercise_plan_id: e.exercise_plan_id, exercise_plan_name: e.exercise_plan_name })) })
        })
        .catch((err) => {
            return next(err)
        })
})

router.post('/plans', (req, res, next) => {
    const { exercise_plan_name } = req.body

    if (!exercise_plan_name) {
        const error = new Error('Missing exercise_plan_name')
        error.status = 400
        return next(error)
    }

    ExercisePlan.create({
        user_id: req.user_id,
        exercise_plan_name
    })
        .then((exercise) => res.json({ exercise }))
        .catch(err => next(err))
})

router.get('/:exercise_id', async (req, res, next) => {
    if (!req.params.exercise_id) {
        const error = new Error('Missing exercise_id')
        error.status = 400
        return next(error)
    }

    const [results] = await db.query("SELECT * FROM exercises WHERE exercise_plan_id IN (SELECT exercise_plan_id FROM exercise_plans WHERE exercise_plan_id = ? AND user_id = ?)", {
        replacements: [req.params.exercise_id, req.user_id]
    })

    return res.json({ data: results })
})

router.post('/:exercise_plan_id', async (req, res, next) => {
    if (!req.params.exercise_plan_id) {
        const error = new Error('Missing exercise_plan_id')
        error.status = 400
        return next(error)
    }

    const exercise_plan = ExercisePlan.findOne({ where: { exercise_plan_id: req.params.exercise_plan_id, user_id: req.user_id } })
    if (!exercise_plan) {
        const error = new Error('Invalid exercise_plan_id')
        error.status = 400
        return next(error)
    }

    if (!req.body.exercises || !Array.isArray(req.body.exercises)) {
        const error = new Error('Missing [exercises] array')
        error.status = 400
        return next(error)
    }

    const result = await Exercise.bulkCreate(
        req.body.exercises
            .filter(e => (e.exercise_plan_id && e.exercise_name))
            .map(e => ({
                exercise_plan_id: req.params.exercise_plan_id,
                exercise_name: e.exercise_name,
            }))
    )

    return res.json({
        added_exercises: result.length
    })
})

module.exports = router
