const sharp = require("sharp");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const { default: slugify } = require("slugify");
const ApiError = require("../utils/apiError");

const Product = require("../models/productModel");
const SubCategory = require("../models/subCategory");
const Category = require("../models/Category");
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');

const factory = require('./handlersFactory');
const asyncHandler = require("../utils/asyncHandler");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");


exports.uploadProductsImages = uploadMixOfImages([
  {
    name:'imageCover',
    maxCount:1
},
{
  name:'images',
  maxCount:'5',

}
]);

exports.resizingProcuctsImages = asyncHandler(async(req,res,next)=>{
 console.log(req.files);
 //1- Image Processing for imageCover
 if(req.files.imageCover) {
  const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`uploads/products/${imageCoverFileName}`)
        req.body.imageCover = imageCoverFileName;
 }
//  //2- Image Processing for images
if(req.files.images) {
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (img,index) =>{
      const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

      await sharp(img.buffer)
      .resize(1000,100)
      .toFormat('jpeg')
        .jpeg({ quality:99 })
        .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      
    })
  )
}
console.log(req.body.imageCover);
console.log(req.body.images)
next();
})

// exports.getProducts = async(req,res)=>{
//     try {
//         const page = req.query.page * 1 || 1;
//         const limit = req.query.limit * 1 ||5;
//         const skip = (page - 1) * limit;

//         console.log(req.query)
      
//         let result =  await Product.findAll({
//           where :req.query,
//           // where: whereClause,
//           offset: skip,  // Sequelize equivalent of skip
//           limit: limit ,
//             include:[{model: SubCategory , as:'subcategories'}]  // Limit the number of results
//         });
//         console.log('[[[[[[[[[[[[[[[[',typeof(req.query.ratingsAverage))
//         // console.log(whereClause);

//         res.send({ status: true, data: result, page, results: result.length });
//     } catch (error) {
//         res.status(500).send({ status: false, message: error.message });
//     }
// }

/////////
// exports.getProducts = async (req, res, next) => {
// // 1)Filtering
// let queryObj = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields','keyword'];
// excludedFields.forEach(field => delete queryObj[field]);
// // Advanced filtering (gte, gt, lte, lt)
// let where = {};
// for (let [key, value] of Object.entries(queryObj)) {
//   if (typeof value === 'object' && value !== null) {
//     // value is an object like { gte: '4.3' }
//     where[key] = {};
//     for (let [operator, val] of Object.entries(value)) {
//       where[key][Op[operator]] = Number(val);
//     }
//   } else {
//     // value is a normal value
//     where[key] = value;
//   }
// }
// console.log('queryObj >>>', queryObj);
// console.log('where >>>', where);

// // 2) Pagination
// const page = parseInt(req.query.page, 10) || 1;
// const limit = parseInt(req.query.limit, 10) || 50;
// const offset = (page - 1) * limit;

// // 3) Sorting
// let order = []; // Default: no sorting
// if (req.query.sort) {
//   const sortFields = req.query.sort.split(',').map(sortField => {
//     if (sortField.startsWith('-')) {
//       return [sortField.substring(1), 'DESC'];
//     }
//     return [sortField, 'ASC'];
//   });
//   order = sortFields;
// }

// // 4) Fields Limiting
// let attributes;
// if (req.query.fields) {
//   const fields = req.query.fields.split(',');
//     if (fields[0].startsWith('-')) {
//       attributes = {
//       exclude: fields.map(field => field.substring(1))
//       };
//   }else{
//     attributes = fields;
//   }
// }

// // 5) Searching
// if (req.query.keyword) {
//  const keyword = req.query.keyword;
//   where[Op.or] = [
//     { title: { [Op.like]: `%${keyword}%` } },
//     { description: { [Op.like]: `%${keyword}%` } }
//   ];
// }
    
// const products = await Product.findAll({
//     where: where,
//     order,
//     attributes,
//     offset,
//     limit,
//     include:[
//       {
//         model: Category,
//         as: 'category',
//         attributes: ['categoryName', 'id']
//       }
//     ]
//     });
    
//     res.status(200).json({
//       results: products.count,
//       page,
//       data: products.rows
//     });
//     // };
//     };
    
//  exports.getProducts = async (req,res) =>{
//  const countDocuments = await Product.count();
//  const apiFeature = new apiFeatures(req.query)
//    .filter()
//    .search('Product')
//    .limitFields()
//    .sort()
//    .paginate(countDocuments);

//  const { queryOptions, paginationResult } = apiFeature;

//  // Step 4: Execute the Sequelize query
//  const products = await Product.findAll(queryOptions);
//  res.status(200).json({
//    results: products.length,
//    paginationResult,
//    data: products,
//    include:[{model: SubCategory , as:'subcategories'}]
//  });
//  }
exports.getProducts = factory.getAll(Product,'Product',[
  {
    model:Category,
    as: 'category',
    attributes: ['categoryName', 'id']
  }
])

exports.getProduct = factory.getOne(Product ,[
  {
    model:Category,
    as: 'category',
    attributes: ['categoryName', 'id']
  },{
    model: Review,
    as : "reviews",
    attributes:["title","ratings","productId"],
     include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'] // fetch only what you need
        }
      ]
  }
])

// exports.store = async (req,res)=>{
//     // try {
 
//     //   let product = new product();
//     //   product.title = title;
//     //   product.slug =  slugify(req.body.title , { lower: true });
//     //   let saved = await product.save() 
//         let product = await Product.create({...req.body ,
//             slug: slugify(req.body.title , { lower: true })
//     });
//     const { subCategoryId} = req.body;
//       const subCategories = await SubCategory.findAll({
//         where: { id: subCategoryId }
//       });
//       await product.setSubcategories(subCategories);
//       res.status(200).send({status:true , data: product})
  
// }

 exports.store = async (req, res) => {
    try {
      const { subCategoryId, ...productData } = req.body; // Make sure the field is subCategoryIds
  
      const product = await Product.create({
        ...productData,
        slug: slugify(productData.title, { lower: true })
      });
     
      if (subCategoryId && subCategoryId.length > 0) {
        const subCategories = await SubCategory.findAll({
          where: { id: subCategoryId }
        });
        
        await product.setSubcategories(subCategories); // Must match 'as' alias in association
      }
  
      // Optionally reload with associations
      const result = await Product.findByPk(product.id, {
        include: {
          model: SubCategory,
          as: 'subcategories'
        }
      });
  
      res.status(200).send({ status: true, data: result });
  
    } catch (err) {
      console.error(err); // 👈 Log errors for debugging
      res.status(500).send({ status: false, error: err.message });
    }
};

// exports.update = async(req,res,next)=>{
//     try{
//     let product = await Product.findByPk(req.params.id);
//     if (!product) {
//         next(new ApiError('No product for this id' , 404));
//     }
//     if(req.body.title){ // to chek first if i need to update title field or not To .. update slug accordingly ...
//     req.body.slug = slugify(req.body.title)
//     }
//     let updated = await product.update(req.body ,{
//       include:{
//         model : SubCategory ,
//         as:'subcategories'
//       }
//     })
//     const { subCategoryId} = req.body.subCategoryId;
//     if (subCategoryId && subCategoryId.length > 0) {
//       const subCategories = await SubCategory.findAll({
//         where: { id: subCategoryId }
//       });
      
//       await product.setSubcategories(subCategories); // Must match 'as' alias in association
//     }

//     // Optionally reload with associations
//     const result = await Product.findByPk(product.id, {
//       include: {
//         model: SubCategory,
//         as: 'subcategories'
//       }
//     });
//     // let updated = await product.update({...req.body ,
//     //     slug: slugify(req.body.title , { lower: true }) // this mean we forced to update title field , but i dont need this
//     // });
//     res.status(200).send({status:true , data: updated})
//     }catch (error) {
//     // res
//     //   .status(400)
//     //   .send({
//     //   status:false ,
//     //    error : 
//     //      Object.keys(error).length > 0 
//     //        ? error.errors[0].message 
//     //        : 'somthing went wrong!'
//     //     }); 
//  }
// }

// exports.update = factory.updateOne(Product);
exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return next(new ApiError('No product for this id', 404));
    }

    // If title is updated, regenerate slug
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true });
    }
    // Update product basic fields
    await product.update(req.body);

    // Handle Subcategories
    const subCategoryId = req.body.subCategoryId;
    if (Array.isArray(subCategoryId) && subCategoryId.length > 0) {
      const subcategories = await SubCategory.findAll({
        where: { id: subCategoryId }
      });
      await product.setSubcategories(subcategories); 
    }

    // Reload product with associations
    const result = await Product.findByPk(product.id, {
      include: {
        model: SubCategory,
        as: 'subcategories'
      }
    });

    res.status(200).send({ status: true, data: result });
    
  } catch (error) {
    res.status(400).send({
      status: false,
      error: error?.errors?.[0]?.message || 'Something went wrong!'
    });
  }
}
exports.destroy = factory.deleteOne(Product)
exports.softDelete = factory.softDeleteOne(Product)
