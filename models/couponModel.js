const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon',{
    name:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            notNull: { msg:'Coupon name required' }
        }
    },
    expire:{
        type: DataTypes.DATE,
        allowNull:false,
        validate:{
            notNull: { msg: 'Coupon expire time required' },
            isDate: { msg: 'Expire must be a valid date' },
        }
    },
    discount:{
         type: DataTypes.FLOAT, // or INTEGER if discount must be a whole number
    allowNull: false,
    validate: {
      notNull: { msg: 'Coupon discount value required' },
      isNumeric: { msg: 'Discount must be a number' },
    },
   },


},{
    timestamps:true,
    paranoid:true
}
)

module.exports = Coupon;