const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define('category',{
    id:{
        type: DataTypes.BIGINT({unsigned:true , zerofill:false}),
        primaryKey:true ,
        autoIncrement : true
    },
  categoryName:{
        type:DataTypes.STRING(100),
        allowNull:false,
        unique:{msg : "Name Already existed , Use Another!"},
        validate:{
            notNull: { msg: 'Category required' },
            len: {
              args: [3, 32],
              msg: 'Category name must be between 3 and 32 characters'
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
        tableName : 'category',
        paranoid : true, // soft delete in laravel 
        // hooks:{
        //   afterFind: (result) => {
        //     // Handles both single and array of results
        //     const processImage = (doc) => {
        //       if (doc && doc.image) {
        //         doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
        //       }
        //     };
        //     if (Array.isArray(result)) {
        //       result.forEach(processImage); // Loops over each item => calls processImage()
        //     } else {
        //       processImage(result); // single object  => calls processImage() directly. 
        //     }
        //   },
        //   afterCreate: (doc) => {
        //     if (doc.image) {
        //       doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
        //     }
        //   },
        //   afterUpdate: (doc) => {
        //     if (doc.image) {
        //       doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
        //     }
        //   }
        // }
   }
  )

  const setImageURL = (doc) =>{
    if(doc && doc.image) {
      doc.image = `${process.env.BASE_URL}/categories/${doc.image}`
    }
  };
  Category.addHook('afterFind' ,(result)=>{
    if(Array.isArray(result)) {
      result.forEach(setImageURL);
    } else {
      setImageURL(result);
    }
  })
  Category.addHook('afterCreate', (doc) => {
    setImageURL(doc)
  })
  Category.addHook('afterUpdate', (doc) => {
    setImageURL(doc)
  })

module.exports = Category;