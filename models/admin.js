const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const admin = sequelize.define('Admin', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    email: {
        allowNull: false,
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = admin