const { DataTypes, DATE } = require('sequelize')
const sequelize = require('../config/database')
const bcrypt = require('bcrypt')

const User = sequelize.define('user' , {

    id:{
        type:DataTypes.BIGINT({unsigned:true , zerofill:false}),
        autoIncrement: true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: {msg: 'name required'},

        }

    },
    slug:{
        type:DataTypes.STRING,
        set(value){
         this.setDataValue('slug' , value.toLowerCase())
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull : false,
        unique:true,
        validate:{
            isEmail:true,
            notEmpty : {msg : 'email required'},
            notNull: {msg : 'email required'}
        },
        // toLowerCase: true
         set(value){
            this.setDataValue('email' ,  value.toLowerCase())

        }
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:true,  
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{msg : 'password required'},
            len: {
                args:[6],
                msg:'Too short Password'
            }
        }
    },
    passwordChangedAt :{
        type : DataTypes.DATE
    },
    passwordResetCode : {
        type: DataTypes.STRING,
    },
    passwordResetExpires:{
        type: DataTypes.DATE,
    },
    passwordResetVerified:{
        type: DataTypes.BOOLEAN,
    },
    
    profileImg:{
        type: DataTypes.STRING,
          allowNull: true
    },
    role:{
         type: DataTypes.ENUM('user', "manager" , 'admin'),
         defaultValue: 'user'
    },
    active:{
        type:DataTypes.BOOLEAN,
        defaultValue :true,
    }
},{
    timestamps:true,
    paranoid:true,
    tableName:'users',
    hooks:{
      beforeSave: async (user, options) => {
         console.log("from save",user.password)

        if (user.changed('password')) {
         user.password = await bcrypt.hash(user.password, 12);
       }
     },
    //   beforeUpdate: async (user, options) => {
    //      console.log("from update",user.password)
    //     if (user.changed('password')) {
    //       user.password = await bcrypt.hash(user.password, 12);
    // }
    //  }
    }
   }
)

module.exports = User;