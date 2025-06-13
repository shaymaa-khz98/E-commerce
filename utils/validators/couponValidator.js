const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/express-validator");
const Coupon = require("../../models/couponModel");

exports.getCouponValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (value) => {
      const coupon = await Coupon.findByPk(value);
      if (!coupon) {
        return Promise.reject("coupon ID does not exist");
      }
    }),
  validatorMiddleware,
];

exports.storeCouponValidator = [ 
  check("name")
    .notEmpty() 
    .withMessage("name Required")
    .custom(async(val, { req }) => {
      const coupon = await Coupon.findOne({
        where:{
          name : val
        }})
      if(coupon){
        return Promise.reject('Coupon with this name and expiry already exists')
      }
        return true;
    }),
    check('expire')
    .notEmpty().withMessage('Coupon expiry date is required'),
    check('discount')
    .notEmpty()
    .withMessage('Coupon discount value is required')
    .isFloat({ gt: 0 })
    .withMessage('Discount must be a positive number'),
  validatorMiddleware,
];
exports.updateCouponValidator = [
   check("name")
    .optional()
    .custom(async(val, { req }) => {
      const coupon = await Coupon.findOne({
        where:{
          name : val
        }})
      if(coupon){
        return Promise.reject('Coupon with this name and expiry already exists')
      }
        return true;
    }),
    check('discount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Discount must be a positive number'),
     check('id')
    .custom(async (value) => {
      const coupon = await Coupon.findByPk(value);
      if (!coupon) {
        return Promise.reject("Coupon ID does not exist");
      }
    }),
  validatorMiddleware,
];
exports.deleteCouponValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (value) => {
      const coupon = await Coupon.findByPk(value);
      if (!coupon) {
        return Promise.reject("Coupon ID does not exist");
      }
    }),
  validatorMiddleware,
];
