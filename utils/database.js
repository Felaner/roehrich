const Sequelize = require('sequelize')
const keys = require('../keys/index');

const DB_NAME = keys.DATABASE_NAME
const USER_NAME = keys.DATABASE_USER
const PASSWORD = keys.DATABASE_PASS

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: keys.HOST,
  dialect: 'mysql'
})

module.exports = sequelize