const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')

const CartItem = sequelize.define('CartItem', {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    color: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
    },
  },{
    timestamps : true,
    paranoid:true
  });

  module.exports = CartItem;
