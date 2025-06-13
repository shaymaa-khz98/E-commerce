const asyncHandler = require("../utils/asyncHandler");
const { v4: uuidv4 } = require('uuid');
const sharp = require("sharp");

const User = require("../models/userModel");
const factory = require('./handlersFactory');
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

//Upload Single Image
exports.uploadUserImage = uploadSingleImage('profileImg');

//Image Processing
exports.resizingImage = asyncHandler(async(req,res,next) =>{
  // console.log(req.file);
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`
  if(req.file){
  await sharp(req.file.buffer)
  .resize(600,600)
  .toFormat('jpeg')
  .jpeg({ quality: 95 })
  .toFile(`uploads/users/${filename}`);
  //Save Image into our DB
  req.body.profileImg = req.hostname+filename; 
  }
 
  next(); // promise , await befor next midellware
}) // 1- put the photo on memoryStorage => 2- resizing =>  3- save it in DiskStorage through (toFile)


exports.getUsers = factory.getAll(User)
exports.getUser = factory.getOne(User);

exports.store = factory.storeOne(User);  

exports.update = asyncHandler(async(req,res,next) =>{
        const {id} = req.params;
        const user = await User.findByPk(id);
        if(!user) {
           return next(new ApiError(`No document for this id ${id}`))
        }
        const updated = await user.update({
            role: req.body.role
        },  
      )
      const updatedUser = { ...user.get() }
      // delete updatedUser.password;
       res.status(200).send({
       status: 'success',
       data: updatedUser
  });
      
})
// exports.changeUserPassword = asyncHandler(async(req,res,next) =>{
//   const {id} = req.params;
//         const user = await User.findByPk(id);
//         if(!user) {
//            return next(new ApiError(`No document for this id ${id}`))
//         }
//       //   const updated = await user.update({
//       //       password: req.body.password,
//       //       passwordChangedAt : Date.now()
//       //   },
//       // )
      
//       user.password = req.body.password,
//       user.passwordChangedAt = Date.now()
//       await user.save(); 

//        // Remove sensitive data like password if needed
//   const updatedUser = { ...user.get() }
//   res.status(200).send({
//     status: 'success',
//     data: updatedUser
//   });
      
// })
exports.destroy = factory.deleteOne(User);
exports.softDelete = factory.softDeleteOne(User);

exports.getLoggedUserData = asyncHandler(async(req,res,next)=>{
  req.params.id = req.user.id;
  next();
});

exports.updateLoggedUserPassword = asyncHandler(async(req,res,next)=>{
  // 1) Update user password based on payload (req.user.id)
        const user = await User.findByPk(req.user.id);
        if(!user) {
           return next(new ApiError(`No document for this id ${id}`))
        }
      //   const updated = await user.update({
      //       password: req.body.password,
      //       passwordChangedAt : Date.now()
      //   },
      // )
      
      user.password = req.body.password,
      user.passwordChangedAt = Date.now()
      await user.save(); 

  // 2) Generate token 
  const token = createToken(user.id);

  const updatedUser = { ...user.get() }
  res.status(200).send({
    status: 'success',
    data: updatedUser,
    token
  });
});

exports.updateLoggedUserData = asyncHandler(async(req,res,next)=> {
        const user = await User.findByPk(req.user.id);
        if(!user) {
           return next(new ApiError(`No document for this id ${id}`))
        }
        const updated = await user.update({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            profileImg: req.body.profileImg,
        },  
      )
      const updatedUser = { ...user.get() }
      // delete updatedUser.password;
       res.status(200).send({
       status: 'success',
       data: updatedUser
})
})

exports.deActivateLoggedUserData = asyncHandler(async(req,res,next) =>{
  const user = await User.findByPk(req.user.id);
  await user.update({active : false})
  res.status(204).send({status:"success"})
})


exports.reactivateAccount = asyncHandler(async(req,res,next) =>{
  const user = await User.findByPk(req.user.id);
  
  if (user.active === true) {
    return next(new ApiError('Account is already active', 400));
  }

  user.active = true;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Your account has been reactivated successfully',
  });
})