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

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql', // أو postgres حسب قاعدة بياناتك
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
});

module.exports = sequelize;
