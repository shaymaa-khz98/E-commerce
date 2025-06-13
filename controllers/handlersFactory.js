const ApiError = require("../utils/apiError");
const apiFeatures = require("../utils/apiFeatures");
const asyncHandler = require("../utils/asyncHandler");


exports.getAll = (Model, modelName, includeOptions = null) =>{
   return asyncHandler(async (req, res, next) => {
      let filter = {};
      if (req.filterObj) {
        filter = req.filterObj;
      }
      const countDocuments = await Model.count({ where: filter });
      
      const apiFeature = new apiFeatures(req.query)
        .filter()
        .search(modelName)
        .limitFields()
        .sort()
        .paginate(countDocuments);

      const { queryOptions, paginationResult } = apiFeature;
      queryOptions.where = {
      ...filter,
      ...(queryOptions.where || {}) // Preserve search and merge with filter
      };
      
    if (includeOptions) {
     queryOptions.include = includeOptions;
    }
      //Execute the Sequelize query
      const documents = await Model.findAll(queryOptions);
      res.status(200).send({
        results: documents.length,
        paginationResult,
        data: documents,
      });
   })
}
exports.getOne = (Model, includeOptions = null) => {
   return asyncHandler(async (req, res, next) => {
     const { id } = req.params;
     const queryOptions = {
       where: { id },
     };
     // Add 'include' if provided
     if (includeOptions) {
       queryOptions.include = includeOptions;
     }
     const document = await Model.findOne(queryOptions);
     if (!document) {
       return next(new ApiError(`No document for this id ${id}`, 404));
     }
     res.status(200).send({ data: document });
   });
 };
 

exports.storeOne = (Model) =>{
   return asyncHandler(async(req,res) => { 
   // Automatically set the logged-in user's ID
    if (req.user && req.user.id) {
      req.body.userId = req.user.id;
    }
      const document = await Model.create(req.body);
      res.status(201).send({status:true , data :document})
      console.log(req.file)
      console.log('/////////',req.body)
   })
}
exports.updateOne = (Model , includeOptions = null) => {
   return asyncHandler(async(req,res,next) => {
      const {id} = req.params;
      const document = await Model.findByPk(id);
      if(!document) {
         return next(new ApiError(`No document for this id ${id}`))
      }
     await document.update(req.body)
     
      // res.status(204).send({data : document})
      // const updatedUser = { ...document.get() }
      // res.status(200).send({
      //   status: 'success',
      //   data: updatedUser,
      // });
      const queryOptions = {
      where: { id },
    };
    if (includeOptions) {
      queryOptions.include = includeOptions;
    }
    const updatedDocument = await Model.findOne(queryOptions);
    res.status(200).json({
      status: 'success',
      data: updatedDocument,
    });
  });
    
}

exports.deleteOne = (Model)=> {
return asyncHandler(async(req,res,next) =>{
    const {id} = req.params;
    const document = await Model.findByPk(id);
    if(!document) {
       return next(new ApiError(`No document for this id ${id}`))
    }
    await document.destroy({ force: true });
    res.status(204).send()
 })
}
exports.softDeleteOne = (Model)=> {
return asyncHandler(async(req,res,next) =>{
    const {id} = req.params;
    const document = await Model.findByPk(id);
    if(!document) {
       return next(new ApiError(`No document for this id ${id}`))
    }
    await document.destroy();
    res.status(204).send()
 })
}

