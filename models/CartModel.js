const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')

const Cart = sequelize.define('Cart', {
    totalCartPrice: {
      type: DataTypes.FLOAT,
    },
    totalPriceAfterDiscount: {
      type: DataTypes.FLOAT,
    },
  },{
    timestamps : true,
    paranoid:true
  });

  module.exports = Cart;