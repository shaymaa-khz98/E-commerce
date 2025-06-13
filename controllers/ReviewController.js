const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const factory = require('./handlersFactory');

//Nested Rout
exports.createFilterObj = (req,res,next) =>{
   let filterObject = {};
   if (req.params.productId) {
     filterObject = { productId: req.params.productId }; 
   }
   req.filterObj = filterObject; // if ther is a filter Object in the request => give me the data based on filterObject
   next();
}

exports.getReviews = factory.getAll(Review,'Review',[
    {
        model : User,
        as : "user",
        attributes : ["name","id"]
    }
])
exports.getReview = factory.getOne(Review , [
    {
        model : User,
        as : "user",
        attributes : ["name" ,"id"]
    }
]);

exports.setProdutIdAndUserIdToBody = (req,res,next)=> {
   if (!req.body.productId) {
      req.body.productId = req.params.productId;
   }
   if(!req.body.userId) {
    req.body.userId = req.user.id;
   }
   next()
}

exports.storeReview = factory.storeOne(Review);  
exports.updateReview = factory.updateOne(Review , [
    {
        model : User,
        as : "user",
        attributes : ["name"]
    }
]);
exports.destroyReview = factory.deleteOne(Review);
exports.softDeleteReview = factory.softDeleteOne(Review);