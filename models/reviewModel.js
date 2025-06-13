const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const User = require('./userModel');
const Product = require('./productModel');

const { Sequelize } = require('sequelize');


const Review = sequelize.define('Review', {
  title: {
    type: DataTypes.STRING,
  },
  ratings: {
    type: DataTypes.FLOAT,
    allowNull : [false , 'review rating required'],
    validate: {
      min: {
        args: [1],
        msg: 'Min ratings value is 1.0',
      },
      max: {
        args: [5],
        msg: 'Max ratings value is 5.0',
      },
    },
  },
}, {
  timestamps: true,
  paranoid : true,
}); 


// Review.belongsTo(User, {
//   foreignKey: {
//     name: 'userId',
//     allowNull: false,
//   },
//   as: 'user', // A single user in each review
// });

// User.hasMany(Review, {
//   foreignKey: {
//     name: 'userId',
//     allowNull: false,
//   },
//   as: 'reviews', // Multiple reviews by the user
// });


// Review.belongsTo(Product, {
//   foreignKey: {
//     name: 'productId',
//     allowNull: false,
//   },
//   as: 'product', // A single product in each review
// });

// Product.hasMany(Review, {
//   foreignKey: {
//     name: 'productId',
//     allowNull: false,
//   },
//   as: 'reviews', // Multiple reviews for the product
// });

async function calcAverageRatingsAndQuantity(productId) {
  // Step 1: Aggregate ratings using Sequelize
  const result = await Review.findAll({
    where: { productId },
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('ratings')), 'avgRatings'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'ratingsQuantity']
    ],
    raw: true
  });

  const avgRatings = parseFloat(result[0].avgRatings) || 0;
  const ratingsQuantity = parseInt(result[0].ratingsQuantity) || 0;

  // Step 2: Update the product with the aggregated values
  await Product.update(
    { 
      ratingsAverage: avgRatings,
      ratingsQuantity: ratingsQuantity
    },
    {
      where: { id: productId }
    }
  );
console.log(result)

}
Review.afterCreate(async (review, options) => {
  await calcAverageRatingsAndQuantity(review.productId);
});

Review.afterUpdate(async (review, options) => {
  await calcAverageRatingsAndQuantity(review.productId);
});

Review.afterDestroy(async (review, options) => {
  await calcAverageRatingsAndQuantity(review.productId);
});


module.exports = Review;
