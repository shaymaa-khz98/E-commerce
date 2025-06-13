const { check } = require("express-validator")
const SubCategory = require("../../models/subCategory");
const validatorMiddleware = require("../../middlewares/express-validator");
const Category = require("../../models/Category");
const { default: slugify } = require("slugify");

exports.getSubCategoryValidator = [
    check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (value) => {
      const subcategory = await SubCategory.findByPk(value);
      if (!subcategory) {
        return Promise.reject("Sub Category ID does not exist");
      }
    }),
  validatorMiddleware,
]


exports.storeSubCategoryValidator = [
check('name')
.notEmpty()
.withMessage('subCategory Required')
.isLength({min:2})
.withMessage('Too short subCategory name')
.isLength({max:32})
.withMessage('Too long subCategory name')

.custom(async(value ,{req}) =>{
  const categoryId = req.body.categoryId || req.params.categoryId;
  const existing = await SubCategory.findOne({where: {name: value , categoryId }})
  if(existing){
    throw new Error('SubCategory with this name already exists in the selected category.')
  }
})
.custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
    }),

check('categoryId')
.notEmpty()
.withMessage("Category ID can't be null")
.custom(async(value)=>{
    const category = await Category.findByPk(value);
    if(!category){
        return Promise.reject('Category ID does not exist , Sub Category must be belong to Category')
    }

}),validatorMiddleware

]


exports.updateSubCategoryValidator = [
    check("name")
      .notEmpty()
      .withMessage("Sub Category Required")
      .isLength({ min: 3 })
      .withMessage("Too Sub Category name")
      .isLength({ max: 32 })
      .withMessage("Too long Sub Category name")
      .custom((val, { req }) => {
         req.body.slug = slugify(val);
         return true;
       }),
      check('id')
      .custom(async (value) => {
        const subCategory = await SubCategory.findByPk(value);
        if (!subCategory) {
          return Promise.reject("Sub Category ID does not exist");
        }
      }),
    validatorMiddleware,
];


exports.deleteSubCategoryValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (value) => {
      const subCategory = await SubCategory.findByPk(value);
      if (!subCategory) {
        return Promise.reject("Sub Category ID does not exist");
      }
    }),
    validatorMiddleware,
];
  
