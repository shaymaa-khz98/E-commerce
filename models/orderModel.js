// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // update the path

const Order = sequelize.define('Order', {
  taxPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  shippingAddress: {
    type: DataTypes.JSON, 
  },
  shippingPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalOrderPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethodType: {
    type: DataTypes.ENUM('card', 'cash'),
    defaultValue: 'cash',
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deliveredAt: {
    type: DataTypes.DATE,
  }
}, {
  timestamps: true,
});
module.exports = Order;