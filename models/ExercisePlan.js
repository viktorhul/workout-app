const Sequelize = require('sequelize')
const db = require('../config/database')

const ExercisePlan = db.define('exercise_plan', {
    exercise_plan_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    exercise_plan_name: {
        type: Sequelize.STRING,
    },
    user_id: {
        type: Sequelize.INTEGER
    }
})

module.exports = ExercisePlan;