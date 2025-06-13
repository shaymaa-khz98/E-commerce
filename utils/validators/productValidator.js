const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/express-validator");
const Category = require("../../models/Category");
const Brand = require("../../models/brandModel");
const SubCategory = require("../../models/subCategory");
const Product = require("../../models/productModel");



exports.storeProductValidator = [
  check("title")
    .notEmpty().withMessage("Product title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val); // Inject slug based on title
      return true;
    }),

  check("description")
    .notEmpty().withMessage("Product description is required")
    .isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),

  check("quantity")
    .notEmpty().withMessage("Product quantity is required")
    .isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),

  check("sold")
    .optional()
    .isInt({ min: 0 }).withMessage("Sold must be a non-negative integer"),

  check("price")
    .notEmpty().withMessage("Product price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a valid number"),

  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product priceAfterDiscount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price !== undefined && value >= req.body.price) {
        throw new Error('priceAfterDiscount must be lower than price');
      }
      return true;
    }),

  check('colors')
    .optional()
    .isArray()
    .withMessage('availableColors should be an array of strings'),

  check("imageCover")
    .notEmpty().withMessage("Cover image is required"),

  check("images")
    .optional()
    .isArray().withMessage("Images must be an array of strings"),

  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1.0, max: 5.0 }).withMessage("Rating must be between 1.0 and 5.0"),

  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 }).withMessage("Ratings quantity must be a non-negative integer"),

  check("categoryId")
    .notEmpty().withMessage("Category is required")
    .isInt().withMessage("Category ID must be a number")
    .custom(async (value) => {
      const category = await Category.findByPk(value);
      if (!category) {
        throw new Error(`No category found for ID ${value}`);
      }
      return true;
    }),

  check("brandId")
    .optional()
    .isInt().withMessage("Brand ID must be a number")
    .custom(async (value) => {
      const brand = await Brand.findByPk(value);
      if (!brand) {
        throw new Error(`No brand found for ID ${value}`);
      }
      return true;
    }),

  check("subCategoryId")
    .optional()
    .isArray().withMessage("Subcategories must be an array of IDs")
    .custom(async (subIds, { req }) => {
      const categoryId = parseInt(req.body.categoryId); // Normalize type
      const subCategoryIds = subIds.map(id => parseInt(id)); // Normalize subcategory IDs too

      const found = await SubCategory.findAll({ where: { id: subCategoryIds } });

    if (found.length !== subCategoryIds.length) {
      throw new Error("Some subcategory IDs are invalid");
    }
    const invalid = found.some(sc => sc.categoryId !== categoryId);
    if (invalid) {
      throw new Error("One or more subcategories do not belong to the specified category");
    }
      return true;
    })
    ,
    check("ratingsAverage")
    .optional()
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("Rating must be between 1.0 and 5.0"),
    check("ratingsQuantity")
  .optional()
  .isInt({ min: 0 }).withMessage("ratingsQuantity must be an integer"),

  
  validatorMiddleware,
];
exports.getProductValidator = [
  check('id')
    .isInt().withMessage('Invalid ID format, expected integer'), 
  validatorMiddleware,
];

exports.updateProductValidator = [
  check('id')
    .isInt().withMessage('Invalid ID format, expected integer'),
  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check('subCategoryId')
    .optional()
    .custom(async (value, { req }) => {
      let subCategoryIds;

      // Normalize to Array
      if (typeof value === 'string') {
        subCategoryIds = JSON.parse(value);
      
      }if (Array.isArray(value)) {
        subCategoryIds = value;
      } else {
        throw new Error('Subcategories must be an array');
      }
      const productId = req.params.id;
      if (!productId) {
        throw new Error('Item ID is required for update validation');
      }
  
      const existingItem = await Product.findByPk(productId); 
      if (!existingItem) {
        throw new Error('Item not found');
      }
  
      const existingCategoryId = Number(existingItem.categoryId);

      // Normalize elements to integers
      subCategoryIds = subCategoryIds.map(id => parseInt(id));

      // Check if all IDs exist
      const foundSubCategories = await SubCategory.findAll({
        where: { id: subCategoryIds },
        attributes: ['id', 'categoryId']
      });
  
      if (foundSubCategories.length !== subCategoryIds.length) {
        throw new Error('Some subcategory IDs are invalid');
      }
  
      // 3. Validate all belong to the existing category
      const invalid = foundSubCategories.some(sc => Number(sc.categoryId) !== existingCategoryId);
      if (invalid) {
        throw new Error('One or more subcategories do not belong to the existing category');
      }
  
      return true;  
    }),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check('id')
    .isInt().withMessage('Invalid ID format, expected integer'),
  validatorMiddleware,
];
