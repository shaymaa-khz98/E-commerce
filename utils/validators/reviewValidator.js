const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/express-validator");
const Review = require("../../models/reviewModel");
const { default: slugify } = require("slugify");
const Product = require("../../models/productModel");

exports.getReviewValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (value) => {
      const brand = await Brand.findByPk(value);
      if (!brand) {
        return Promise.reject("Brand ID does not exist");
      }
    }),
  validatorMiddleware,
];

exports.storeReviewValidator = [
  check("title")
  .optional(),
  check("ratings")
    .notEmpty() 
    .withMessage("ratings value Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be betwen 1 to 5"),
//    check("userId")
//   .custom(async (val, { req }) => {
//   if (String(req.body.userId) !== String(req.user.id)) {
//     throw new Error('User ID in body must match the authenticated user');
//   }
//   return true;
// }),

    check("productId")
    .custom(async(val, { req }) => {
      const product = await Product.findOne({ where:{id : val} })
      if(!product){
        throw new Error('this product doesnt exists')
      }
       // checked if logged user create review befor
     const review = await Review.findOne({ where :{ userId : req.user.id , productId : req.body.productId }})
     if (review) {
      return Promise.reject("You already created a review before")
     }
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check('id')
    .custom(async (val, { req }) => {
      // Check if review exists
      const review = await Review.findByPk(val);
      if (!review) {
        return Promise.reject(`No review found with id: ${val}`);
      }
      // Check if the logged-in user is the review owner
      if (review.userId !== req.user.id) {
        return Promise.reject('You are not allowed to perform this action');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (val , {req}) => {
      if(req.user.role === 'user') {
        const review = await Review.findByPk(val);
      if (!review) {
        return Promise.reject(`No review found with id: ${val}`);
      }
      // Check if the logged-in user is the review owner
      if (review.userId !== req.user.id) {
        return Promise.reject('You are not allowed to perform this action');
      }
    }
    return true;
  }),
  validatorMiddleware,
];
