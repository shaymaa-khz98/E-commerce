const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const Category = require("../models/Category");
const SubCategory = require("../models/subCategory");
const factory = require('./handlersFactory');
const asyncHandler = require('../utils/asyncHandler');

const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

//Upload Single Image
exports.uploadCategoryImage = uploadSingleImage('image');

//Image Processing
exports.resizingImage = asyncHandler(async(req,res,next) =>{
  if(req.file){
  console.log(req.file);
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`
  await sharp(req.file.buffer)
  .resize(600,600)
  .toFormat('jpeg')
  .jpeg({ quality: 95 })
  .toFile(`uploads/categories/${filename}`);
  req.body.image = filename; 
  }
  next();
qq
  // promise , await befor next midellware
}) // 1- put the photo on memoryStorage => 2- resizing =>  3- save it in DiskStorage through (toFile)


// exports.getCategories = async(req,res)=>{
    
//       const countDocuments = await Category.count();
//       const apiFeature = new apiFeatures(req.query)
//         .filter()
//         .search('Category')
//         .limitFields()
//         .sort()
//         .paginate(countDocuments);
     
//       const { queryOptions, paginationResult } = apiFeature;
//       queryOptions.include = [{ model: SubCategory }];

//       // Step 4: Execute the Sequelize query
//       const Categories = await Category.findAll(queryOptions);
//       res.status(200).send({
//         results: Categories.length,
//         paginationResult,
//         data: Categories,
//       });
// }

exports.getCategories = factory.getAll(Category,'Category',[
  {
    model:SubCategory,
    attributes:['id','name']

}])
exports.getCategory = factory.getOne(Category,[
  {
    model: SubCategory,
    attributes: ['id','name']
  }
])
// exports.getCategory = async(req,res,next)=>{
//     // let validator = validationResult(req);
//     // if(validator.isEmpty()){
//         const category = await Category.findOne({
//             where:{id : req.params.id},
//             include:[{model: SubCategory}]
//         })
//         if(category){
//         res.send({status:true , Category: category})
//         }
//         next(new ApiError('No category for this iddd' , 404));
//     // }else{
//     //     res.status(404).send({status:false ,
//     //         message : 
//     //         validator.array({onlyFirstError:true})[0]})
//     // } 
// //  const subCategories = await category.getSubCategory()
// //  res.send({data : result , subCategories: subCategories})
    

// }

exports.store = factory.storeOne(Category);

exports.update = factory.updateOne(Category);

exports.destroy = factory.deleteOne(Category);

exports.softDelete = factory.softDeleteOne(Category);

