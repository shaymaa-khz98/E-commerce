const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/express-validator");
const User = require("../../models/userModel");

const bcrypt = require('bcrypt');
const { default: slugify } = require("slugify");

exports.getUserValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        return Promise.reject("User ID does not exist");
      }
    }),
  validatorMiddleware,
];

exports.storeUserValidator = [
  check("name")
    .notEmpty() 
    .withMessage("User Required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .isLength({ max: 32 })
    .withMessage("Too long User name")
  .custom((val, { req }) => {
       req.body.slug = slugify(val);
       return true;
     }),

    check('email')
      .notEmpty()
      .withMessage('Email Required')
      .isEmail()
      .withMessage('invalid email address')
      .custom(async(val)=>{
       const user = await User.findOne({where :{email: val}})
       if(user){
        return Promise.reject('E-mail already in use ')
       }
      }),

      check('password')
       .notEmpty()
       .withMessage('password required')
       .isLength({ min:6 })
       .withMessage('Password must be at least 6 characters')
       .custom((password ,{req}) => {
        if(password !== req.body.PasswordConfirm){
          throw new Error("password confirmation is incorrect");
        }
        return true;
       }),
     
      check('profileImg')
      .optional(),

       check('phone')
      .optional()
      .isMobilePhone("ar-PS","ar-EG")
      .withMessage("invalid phone number"),

      check('PasswordConfirm')
      .notEmpty()
      .withMessage('PasswordConfirm required'),

      check('role').optional(),   
   validatorMiddleware,
];

// exports.updateUserValidator = [
//   check("name")
//     .optional()
//     .isLength({ min: 3 })
//     .withMessage("Too short User name")
//     .isLength({ max: 32 })
//     .withMessage("Too long User name")
//     .custom((val, { req }) => {
//        req.body.slug = slugify(val);
//        return true;
//      }),
//      check('id')
//     .custom(async (value) => {
//       const user = await User.findByPk(value);
//       if (!user) {
//         return Promise.reject("User ID does not exist");
//       }
//     }),
//     check('email')
//       .optional()
//       .isEmail()
//       .withMessage('invalid email address')
//       .custom(async(val)=>{
//        const user = await User.findOne({where :{email: val}})
//        if(user){
//         return Promise.reject('E-mail already in use ')
//        }

//       }),
//       check('profileImg')
//       .optional(),

//        check('phone')
//       .optional()
//       .isMobilePhone("ar-PS","ar-EG")
//       .withMessage("invalid phone number"),

      
// check('role')
//   .optional()
//   .custom((value, { req }) => {
//     // Only allow role updates if current user is admin
//     if (req.user.role !== 'admin') {
//       throw new Error('You are not authorized to update the role');
//     }

//     // Optionally, restrict role values
//     const allowedRoles = ['user', 'admin'];
//     if (!allowedRoles.includes(value)) {
//       throw new Error('Invalid role');
//     }

//     return true;
//   })
//   ,validatorMiddleware,
// ];

exports.changeUserPasswordValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer"),
  body('currentPassword')
  .notEmpty()
  .withMessage('you must enter your current password'),
  body('passwordConfirm')
  .notEmpty()
  .withMessage('you must enter your current password confirm'),
  body('password')
  .notEmpty()
  .withMessage('you must enter a new password')
  .custom(async(val , {req})=> {
    // 1) verify current password
    const user = await User.findByPk(req.params.id)
    if(!user){
      throw new Error('There is no user for this id')
    }
    const isCorrectedPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    )
    if(!isCorrectedPassword){
      throw new Error("Incorrect current Password");
      
    }
    // 2) verify password confirm
    if(val !== req.body.passwordConfirm){
          throw new Error("password confirmation is incorrect");
      }
      return true;
      }),
validatorMiddleware,
]
exports.deleteUserValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        return Promise.reject("User ID does not exist");
      }
    }),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .isLength({ max: 32 })
    .withMessage("Too long User name")
    .custom((val, { req }) => {
       req.body.slug = slugify(val);
       return true;
     }),
     
    check('email')
      .optional()
      .isEmail()
      .withMessage('invalid email address')
      .custom(async(val)=>{
       const user = await User.findOne({where :{email: val}})
       if(user){
        return Promise.reject('E-mail already in use ')
       }

      }),
      check('profileImg')
      .optional(),

       check('phone')
      .optional()
      .isMobilePhone("ar-PS","ar-EG")
      .withMessage("invalid phone number"),

      
check('role')
  .optional()
  .custom((value, { req }) => {
    // Only allow role updates if current user is admin
    if (req.body.role) {
      throw new Error('You are not authorized to update your role');
    }
    return true;
  })
  ,validatorMiddleware,
];