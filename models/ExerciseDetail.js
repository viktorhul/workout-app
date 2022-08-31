const Sequelize = require('sequelize')
const db = require('../config/database')

const ExerciseDetail = db.define('Exercise_detail', {
    exercise_detail_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    exercise_id: {
        type: Sequelize.INTEGER,
    },
    type: {
        type: Sequelize.INTEGER
    },
    comment: {
        type: Sequelize.STRING
    },
    weight: {
        type: Sequelize.FLOAT
    },
})

module.exports = ExerciseDetail;