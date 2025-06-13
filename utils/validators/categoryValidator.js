const { check } = require("express-validator");
const Category = require("../../models/Category");
const validatorMiddleware = require("../../middlewares/express-validator");
const { default: slugify } = require("slugify");

exports.getCategoryValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (value) => {
      const category = await Category.findByPk(value);
      if (!category) {
        return Promise.reject("Category ID does not exist");
      }
    }),
  validatorMiddleware,
];

exports.storeCategoryValidator = [
  check("categoryName")
    .notEmpty() 
    .withMessage("Category Required")
    .isLength({ min: 3 })
    .withMessage("Too short Category name")
    .isLength({ max: 32 })
    .withMessage("Too long Category name")
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
  validatorMiddleware,
];
exports.updateCategoryValidator = [
  check("categoryName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short Category name")
    .isLength({ max: 32 })
    .withMessage("Too long Category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
     check('id')
    .custom(async (value) => {
      const category = await Category.findByPk(value);
      if (!category) {
        return Promise.reject("Category ID does not exist");
      }
    }),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (value) => {
      const category = await Category.findByPk(value);
      if (!category) {
        return Promise.reject("Category ID does not exist");
      }
    }),
  validatorMiddleware,
];
