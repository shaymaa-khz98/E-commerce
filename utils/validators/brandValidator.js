const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/express-validator");
const Brand = require("../../models/brandModel");
const { default: slugify } = require("slugify");

exports.getBrandValidator = [
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

exports.storeBrandValidator = [
  check("brandName")
    .notEmpty() 
    .withMessage("Brand Required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name")
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
        }),
  validatorMiddleware,
];
exports.updateBrandValidator = [
  check("brandName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name")
    .custom((val, { req }) => {
       req.body.slug = slugify(val);
       return true;
     }),
     check('id')
    .custom(async (value) => {
      const brand = await Brand.findByPk(value);
      if (!brand) {
        return Promise.reject("Brand ID does not exist");
      }
    }),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
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
