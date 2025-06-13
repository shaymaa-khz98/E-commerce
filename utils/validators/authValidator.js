const { check} = require("express-validator");
const validatorMiddleware = require("../../middlewares/express-validator");
const User = require("../../models/userModel");
const { default: slugify } = require("slugify");




exports.signupValidator = [
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
        if(password !== req.body.passwordConfirm){
          throw new Error("password confirmation is incorrect");
        }
        return true;
       }),
     
      check('passwordConfirm')
      .notEmpty()
      .withMessage('PasswordConfirm required'),
   validatorMiddleware,
];
exports.loginValidator = [

    check('email')
      .notEmpty()
      .withMessage('Email Required')
      .isEmail()
      .withMessage('invalid email address'),

      check('password')
       .notEmpty()
       .withMessage('password required')
       .isLength({ min:6 })
       .withMessage('Password must be at least 6 characters')
    
   ,validatorMiddleware,
];

