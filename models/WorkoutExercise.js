const Sequelize = require('sequelize')
const db = require('../config/database')

const WorkoutExercise = db.define('workout_exercise', {
    workout_exercise_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    weight: {
        type: Sequelize.FLOAT,
    },
    exercise_id: {
        type: Sequelize.INTEGER
    },
    workout_id: {
        type: Sequelize.INTEGER
    },
})

module.exports = WorkoutExercise;