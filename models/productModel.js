const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./Category");
const SubCategory = require("./subCategory");
const Brand = require("./brandModel");


const Product = sequelize.define('product', {
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: {
        args: [3, 100],
        msg: 'Product title must be between 3 and 100 characters'
      },
      notEmpty: {
        msg: 'Product title is required'
      }
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('slug', value.toLowerCase());
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [20],
        msg: 'Product description must be at least 20 characters'
      }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      notNull: { msg: 'Product quantity is required' }
    }
  },
  sold: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // 10 total digits, 2 after decimal point
    allowNull: false,
    validate: {
      notNull: { msg: 'Product price is required' }
    }
  },
  priceAfterDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Discounted price cannot be negative',
      },
    },
  },
  
  colors: {
    type: DataTypes.JSON,
    allowNull: true,
    validate: {
      isArrayOfStrings(value) {
        if (value && (!Array.isArray(value) || !value.every(c => typeof c === 'string'))) {
          throw new Error("Colors must be an array of strings");
        }
      }
    }
  },
  imageCover: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Product Image cover is required' }
    }
  },
  images: {
    type: DataTypes.JSON, // You can store array of strings here
    allowNull: true
  },
  ratingsAverage: {
    // type: DataTypes.FLOAT,
    // validate: {
    //   min: {
    //     args: [1],
    //     msg: 'Rating must be above or equal 1.0'
    //   },
    //   max: {
    //     args: [5],
    //     msg: 'Rating must be below or equal 5.0'
    //   }
    // }
    type: DataTypes.DECIMAL(3, 1), // Stores 0.0 to 9.9 (but validate 0-5)
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5  // Restrict to 0-5 range despite wider storage
    }
  },
  ratingsQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  paranoid: true, 
  timestamps: true, 
});


Product.belongsTo(Category, {
    foreignKey: {
      name: 'categoryId',
      allowNull: false
    },
    as: 'category'
  });

  Category.hasMany(Product, {
    foreignKey: 'categoryId',
    as: 'products'
  });

  Product.belongsToMany(SubCategory, {
    through: 'ProductSubCategory',
    as: 'subcategories',
    foreignKey: 'productId',
    otherKey: 'subCategoryId'
  });
  
  SubCategory.belongsToMany(Product, {
    through: 'ProductSubCategory',
    as: 'products',
    foreignKey: 'subCategoryId',
    otherKey: 'productId'
  });
  
  Product.belongsTo(Brand, {
  foreignKey: 'brandId',
  as: 'brand'
});

Brand.hasMany(Product, {
  foreignKey: 'brandId',
  as: 'products'
});


const setImageURL = (doc) =>{
    if(doc && doc.imageCover) {
      doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`
    }
    if(doc && doc.images) {
      const imageList = [];
      doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`
      imageList.push(imageUrl)

      })
      doc.images = imageList;
    }
    
  };
  Product.addHook('afterFind' ,(result)=>{
    if(Array.isArray(result)) {
      result.forEach(setImageURL);
    } else {
      setImageURL(result);
    }
  })
  Product.addHook('afterCreate', (doc) => {
    setImageURL(doc)
  })
  Product.addHook('afterUpdate', (doc) => {
    setImageURL(doc)
  })

module.exports = Product;
  