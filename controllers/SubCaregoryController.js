const SubCategory = require("../models/subCategory");
const Category = require("../models/Category");
const factory = require('./handlersFactory')


exports.setCategoryIdToBody = (req,res,next)=> {
   if (!req.body.categoryId) {
      req.body.categoryId = req.params.categoryId;
   }
   next()
}
exports.createFilterObj = (req,res,next) =>{
   let filterObject = {};
   if (req.params.categoryId) {
     filterObject = { categoryId: req.params.categoryId }; 
   }
   req.filterObj = filterObject;
   next();
}
// exports.getSubCategories = async(req,res)=>{
//    // const filterObject = req.filterObj || {}; // Get the filter object from the middleware
//    const countDocuments = await SubCategory.count();
//    const apiFeature = new apiFeatures(req.query)
//         .filter()
//         .search('SubCategory')
//         .limitFields()
//         .sort()
//         .paginate(countDocuments);
     
//       const { queryOptions, paginationResult } = apiFeature;
     
//       // Step 4: Execute the Sequelize query
//       const subCategories = await SubCategory.findAll(queryOptions);
//       res.status(200).json({
//         results: subCategories.length,
//         paginationResult,
//         data: subCategories,
//         include: [{ model: Category, attributes: ['id', 'categoryName'] }],
//       });
//       // const subCaregories = await SubCategory.findAll({
//       //    where: filterObject,
//       //    offset: skip,
//       //    limit:limit
//       // });
// }

exports.getSubCategories = factory.getAll(SubCategory ,'SubCategory',[
   {
     model: Category,
     attributes: ['id', 'categoryName'],
    //  as :'SubCategory'
   }
 ])
exports.getSubCategory = factory.getOne(SubCategory ,'SubCategory',[
   {
     model: Category,
     attributes: ['id', 'categoryName'],
     as :'SubCategory'
   }
 ])
// async(req,res ,next)=>{
// const {id} = req.params;
// const subCategory = await SubCategory.findByPk(id, {
//    include: [{
//      model: Category,
//      attributes: ['categoryName'], // Select fields
// }] ,
// })
// if(!subCategory){
//    return next(new ApiError(`No sub category for this id ${id}`))
// }
// res.send({status:true , subCaregory:subCategory})
// }

exports.store = factory.storeOne(SubCategory);

exports.update = factory.updateOne(SubCategory);

exports.destroy = factory.deleteOne(SubCategory);

exports.softDelete = factory.softDeleteOne(SubCategory);