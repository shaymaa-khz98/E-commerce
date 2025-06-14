// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize({
//     host : "localhost",
//     port : 3306,
//     username : "root",
//     password : "123123",
//     database : "e-commerce",
//     dialect : "mysql",
// }) 

// module.exports = sequelize;

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // أو true لو بتحب تشوف الـ SQL
  }
);

module.exports = sequelize;
