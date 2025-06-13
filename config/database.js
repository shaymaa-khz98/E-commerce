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

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "bnqg4bxlqr3odoqj1rma", // database name
  "uo65gaeqx6mgo3t0",     // username
  "EiRoi0r9lCbzWyMvmtCC", // password
  {
    host: "bnqg4bxlqr3odoqj1rma-mysql.services.clever-cloud.com",
    port: 3306,
    dialect: "mysql",
    logging: false, // optional: to disable SQL logging in console
  }
);

module.exports = sequelize;