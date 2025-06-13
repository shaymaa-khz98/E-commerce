const { DataTypes } = require('sequelize');
const sequlize = require('../config/database')

const Address = sequlize.define('address' ,{
    alias: {
    type: DataTypes.STRING,
  },
  details: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  postalCode: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: true,
  paranoid:true
})

module.exports = Address;