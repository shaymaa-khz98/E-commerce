// models/subCategory.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./Category");

const SubCategory = sequelize.define(
  "SubCategory",
  {
    id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "SubCategory must be unique",
      },
      validate: {
        len: {
          args: [2, 32],
          msg: "SubCategory name must be between 2 and 32 characters",
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue("slug", value.toLowerCase());
      },
    },
    categoryId: {
      type: DataTypes.BIGINT({unsigned:true , zerofill:false}),
      allowNull: false,
      references: {
        model: "Category",
        key: "id",
      },
      validate: {
        notNull: {
          msg: "SubCategory must belong to parent category",
        },
      },
    },
  },{
    timestamps :true ,
    tableName : 'subCategory',
    paranoid : true // soft delete in laravel
  
  }
  
);

Category.hasMany(SubCategory, {
  foreignKey: "categoryId",
  onDelete: "RESTRICT",
  
});
SubCategory.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "RESTRICT",
});

module.exports = SubCategory;
