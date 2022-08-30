const Sequelize = require('sequelize')
const db = require('../config/database')

const Exercise = db.define('exercise', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    exercise_name: {
        type: Sequelize.STRING
    },
    comment: {
        type: Sequelize.STRING
    },
    lastCompleted: {
        type: Sequelize.DATE
    },
})

module.exports = Exercise;