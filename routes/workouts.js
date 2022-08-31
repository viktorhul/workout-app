const express = require('express')
const { Error } = require('sequelize')
const router = express.Router()

const db = require('../config/database')

const Exercise = require('../models/Exercise')
const ExercisePlan = require('../models/ExercisePlan')
const Workout = require('../models/Workout')
const WorkoutExercise = require('../models/WorkoutExercise')

router.get('/', async (req, res, next) => {
    try {
        const [results] = await db.query("SELECT a.workout_id, b.exercise_plan_name FROM workouts a INNER JOIN exercise_plans b ON a.exercise_plan_id = b.exercise_plan_id WHERE a.user_id = ? AND a.completed = false", {
            replacements: [req.user_id]
        })

        return res.json({ data: results })
    } catch (error) {
        return next(error)
    }
})

router.post('/new/:exercise_id', async (req, res, next) => {
    if (!req.params.exercise_id) {
        const error = new Error('Missing exercise_id')
        error.status = 400
        return next(error)
    }

    try {
        const exercisePlan = await ExercisePlan.findOne({ where: { user_id: req.user_id, exercise_plan_id: req.params.exercise_id } })

        if (!exercisePlan) {
            const error = new Error('Invalid exercise_plan_id')
            error.status = 400
            return next(error)
        }

        await Workout.create({ user_id: req.user_id, exercise_plan_id: req.params.exercise_id })
        return res.json({ ok: true })
    } catch (error) {
        return next(error)
    }
})

router.post('/complete', async (req, res, next) => {
    if (!req.body.workout_id || !req.body.exercise_id) {
        const error = new Error('Missing workout_id or exercise_id')
        error.status = 400
        return next(error)
    }

    const alreadyCompleted = await WorkoutExercise.findOne({
        where: {
            workout_id: req.body.workout_id,
            exercise_id: req.body.exercise_id
        }
    })

    if (alreadyCompleted) {
        const error = new Error('Invalid registration')
        error.status = 400
        return next(error)
    }

    let [results] = await db.query("SELECT * FROM exercise_plans WHERE user_id = ? AND exercise_plan_id IN (SELECT exercise_plan_id FROM exercises WHERE exercise_id = ?); SELECT * FROM workouts WHERE workout_id = ? AND user_id = ?", {
        replacements: [req.user_id, req.body.exercise_id, req.body.workout_id, req.user_id]
    })

    if (results[0].length != 1 || results[1].length != 1) {
        const error = new Error('workout_id or exercise_id incorrect')
        error.status = 400
        return next(error)
    }

    const exercise_plan_id = results[0][0].exercise_plan_id

    await WorkoutExercise.create({
        weight: req.body.weight,
        exercise_id: req.body.exercise_id,
        workout_id: req.body.workout_id,
    })

    const query = "SET @completed := (SELECT COUNT(*) FROM workout_exercises WHERE workout_id = ?);" +
        "SET @total := (SELECT COUNT(*) FROM exercises WHERE exercise_plan_id = ?);" +
        "SELECT @completed as completed, @total as total;"

    db.query(query, {
        replacements: [req.body.workout_id, exercise_plan_id]
    })
        .then(([data]) => {
            const { completed, total } = data[2][0]
            if (completed == total) {
                db.query("UPDATE workouts SET completed = 1 WHERE workout_id = ?", {
                    replacements: [req.body.workout_id]
                })
                return res.json({ ok: true })
            }
            else {
                return res.json({ ok: true })
            }
            //console.log(data)
        })

    // "SET @completed := (SELECT COUNT(*) FROM workout_exercises WHERE workout_id = ?);" req.body.workout_id
    // "SET @total := (SELECT COUNT(*) FROM exercises WHERE exercise_plan_id = ?);"
    // "SELECT @completed as completed, @total as total;"

    // db.query("set @completed := (SELECT COUNT(*) FROM workout_exercises WHERE workout_id = ?);set @total := (SELECT COUNT(*) FROM exercises WHERE user_id = ? AND exercise_id IN (SELECT * FROM exercise_workouts WHERE ));SELECT @completed as completed, @total as total;", {
    //     replacements: [req.body.workout_id]
    // })
    //     .then((data) => {
    //         console.log(data[0])
    //     })

    // TODO: check if all exercises are complete - complete the workout
})

module.exports = router