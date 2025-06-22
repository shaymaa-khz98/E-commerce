const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    host : "localhost",
    port : 3306,
    username : "root",
    password : "123123",
    database : "e-commerce",
    dialect : "mysql",
}) 

module.exports = sequelize;