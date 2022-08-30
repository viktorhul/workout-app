const { Sequelize } = require('sequelize')

module.exports = new Sequelize('workouts', 'root', 'qwe', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000
    }
})