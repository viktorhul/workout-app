const Sequelize = require('sequelize')
const db = require('../config/database')

const Workout = db.define('workout', {
    workout_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    exercise_plan_id: {
        type: Sequelize.INTEGER
    },
    user_id: {
        type: Sequelize.INTEGER
    },
    completed: {
        type: Sequelize.BOOLEAN
    }
})

module.exports = Workout;