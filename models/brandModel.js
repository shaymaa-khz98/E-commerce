const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Brand = sequelize.define('brand',{
    id:{
        type: DataTypes.BIGINT({unsigned:true , zerofill:false}),
        primaryKey:true ,
        autoIncrement : true
    },
  brandName:{
        type:DataTypes.STRING(100),
        allowNull:false,
        unique:{msg : "Brand Name Already existed , Use Another!"},
        validate:{
            notNull: { msg: 'Brand required' },
            len: {
              args: [3, 32],
              msg: 'Brand name must be between 3 and 32 characters'
            }
        }
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        lowercase: true // Not a built-in Sequelize option, but handled manually
      },
    image: {
        type: DataTypes.STRING,
      }
    },{
        timestamps :true ,
        tableName : 'brand',
        paranoid : true // soft delete in laravel
      
    
   })

   const setImageURL = (doc) =>{
    if(doc && doc.image) {
      doc.image = `${process.env.BASE_URL}/brands/${doc.image}`
    }
  };
  Brand.addHook('afterFind' ,(result)=>{
    if(Array.isArray(result)) {
      result.forEach(setImageURL);
    } else {
      setImageURL(result);
    }
  })
  Brand.addHook('afterCreate', (doc) => {
    setImageURL(doc)
  })
  Brand.addHook('afterUpdate', (doc) => {
    setImageURL(doc)
  })


module.exports = Brand;