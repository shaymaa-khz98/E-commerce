const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require('bcrypt');
const ApiError = require("../utils/apiError");
require('dotenv').config();
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')

const createToken = require("../utils/createToken");


// method to generate token
// const createToken = (payload) => { // if i have an arrow function => default returning value
//   return jwt.sign({userId : payload} , process.env.JWT_SECRET_KEY,{
//         expiresIn : process.env.JWT_EXPIRED_TIME,
//     })
// }



exports.signup = asyncHandler(async(req,res,next) =>{
    // 1) create User
    const user = await User.create({
        name : req.body.name,
        email: req.body.email,
        password : req.body.password

    });
    // 2) Generate Token
    const token = createToken(user.id);
    res.status(201).send({data : user , token}) //201 for create

})

exports.login = asyncHandler(async(req,res,next) =>{
 // 1) check if the password and email in the body (validation layer)
 // 2) check id user exists && check if password correct
 const user = await User.findOne({ where:{ email : req.body.email}});

 if(!user || !(await bcrypt.compare(req.body.password , user.password))){
    return next(new ApiError('incorrect email or password' ,401))
 }
  // 3) generate token
  const token = createToken(user.id);
  // console.log(user.id)
  res.status(200).send({data : user , token :token})
  // 4) send response to the client side
})


exports.protect = asyncHandler(async(req,res,next) => {
  // console.log("[[[[[[[[",req.headers)
  // 1) check if token exist get
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
    console.log(token)
  }
  if(!token) {
    return next(new ApiError('you are not login to get access this rout' , 401))
  }
  // 2) verify token (no change happens , expired token)
   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
   console.log('//////////',decoded);
  // 3) check if user exists
  const currentUser = await User.findByPk(decoded.userId)

  if(!currentUser) {
    return next(new ApiError('the user that belong to this token does no longer exist' , 401)) // if the user was deleted and the token still active
  }
   //4) check if user change his password after token created
   if(currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000 ,10
    )
    console.log(passChangedTimestamp, decoded.iat)
    if(passChangedTimestamp > decoded.iat) {
      return next(new ApiError("User recently changed his password , please login again .." , 401))
    }
   }

  if (currentUser.active === false) {
  return next(new ApiError('Your account is inactive. Please contact support or reactivate it.'));
}
  req.user = currentUser;
  next();
})
exports.softProtect = asyncHandler(async(req,res,next) => {
  console.log(req.headers)
  // 1) check if token exist get
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
    console.log(token)
  }
  if(!token) {
    return next(new ApiError('you are not login to get access this rout' , 401))
  }
  // 2) verify token (no change happens , expired token)
   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
   console.log('//////////',decoded);
  // 3) check if user exists
  const currentUser = await User.findByPk(decoded.userId)

  if(!currentUser) {
    return next(new ApiError('the user that belong to this token does no longer exist' , 401)) // if the user was deleted and the token still active
  }
   //4) check if user change his password after token created
   if(currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000 ,10
    )
    console.log(passChangedTimestamp, decoded.iat)
    if(passChangedTimestamp > decoded.iat) {
      return next(new ApiError("User recently changed his password , please login again .." , 401))
    }
   }
  req.user = currentUser;
  console.log("777777",currentUser.active)
  next();
})
// ["admin" , "manager"]
exports.allowedTo = (...roles) => 
  asyncHandler(async(req,res,next) => {
  // 1) access roles
  // 2) access registered user (req.user.role)

  if(!roles.includes(req.user.role)) {
    return next(
      new ApiError('You are not allowed ti access this route ..' , 403)
    );
  }
  next();
})

exports.forgotPssword = asyncHandler(async(req,res,next) => {
  // 1) Get user by email
  const user = await User.findOne({where :{email : req.body.email}});
  if(!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}` , 404)) // "not Found"
  }

  // 2) If user exist, Generate reset random 6 digits and save it in DB
const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex')
  // save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  //Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false; 
  
  user.save();
  
  console.log(resetCode)
  console.log(hashedResetCode)

  const message = `Hi ${user.name}, \n we received a request to reset the password on your E-shop Acount. \n ${resetCode} \n Enter this code to complete the reset. \n Tanks for helping us keeping your account secure \n the E-shop Team`
  // 3) Send the reset code via email
  try {
    await sendEmail({ 
    email: user.email , 
    subject: `Your password reset code (valid for 10 min)`,
    message,
  });

  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new ApiError("There is an error in sending email" , 500)
    )
  }
  res
  .status(200)
  .send({ status: 'Success' , message :'Recent code sent to email'})

});

exports.verifyPassResetCode = asyncHandler(async (req,res,next) =>{
  // 1) Get user based on reset code 
  const hashedResetCode = crypto
  .createHash('sha256')
  .update(req.body.resetCode)
  .digest('hex');

  const user = await User.findOne({ where :
    { passwordResetCode : hashedResetCode,
    passwordResetExpires: { [Op.gt]: Date.now() }
    },
  
})
  if(!user) {
    return next(new ApiError ("Reset Code is invalid or expired"))
  }
// 2) Reset code valid
 user.passwordResetVerified = true;
 await user.save();

  res.status(200).send({
    status: 'success'
  });

})

exports.resetPassword = asyncHandler(async(req,res,next)=>{
  // 1) Get user based on email
 const user = await User.findOne({ where :{email: req.body.email}})
    if(!user) {
    return next(new ApiError ("Reset Code not verified"))
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = null;
  user.passwordResetExpires = null;
  user.passwordResetVerified = false;

  await user.save();
  // 3) if every thing is ok , generate token

  const token = createToken(user.id);
  res.status(200).send({token})
})
