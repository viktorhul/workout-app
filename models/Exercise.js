const Sequelize = require('sequelize')
const db = require('../config/database')

const Exercise = db.define('exercise', {
    exercise_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    exercise_plan_id: {
        type: Sequelize.INTEGER,
    },
    exercise_name: {
        type: Sequelize.STRING
    },
})

module.exports = Exercise;