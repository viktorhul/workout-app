const { Sequelize } = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            multipleStatements: true
        }
    })