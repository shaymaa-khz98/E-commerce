const asyncHandler = require("../utils/asyncHandler");
const { v4: uuidv4 } = require('uuid');
const sharp = require("sharp");

const Brand = require("../models/brandModel");
const factory = require('./handlersFactory');
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

//Upload Single Image
exports.uploadCategoryImage = uploadSingleImage('image');

//Image Processing
exports.resizingImage = asyncHandler(async(req,res,next) =>{
  // console.log(req.file);
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`
  await sharp(req.file.buffer)
  .resize(600,600)
  .toFormat('jpeg')
  .jpeg({ quality: 95 })
  .toFile(`uploads/brands/${filename}`);
  //Save Image into our DB
  req.body.image = req.hostname+filename; 
  next(); // promise , await befor next midellware
}) // 1- put the photo on memoryStorage => 2- resizing =>  3- save it in DiskStorage through (toFile)


exports.getBrands = factory.getAll(Brand)
exports.getBrand = factory.getOne(Brand);

exports.store = factory.storeOne(Brand);  
exports.update = factory.updateOne(Brand);
exports.destroy = factory.deleteOne(Brand);
exports.softDelete = factory.softDeleteOne(Brand);