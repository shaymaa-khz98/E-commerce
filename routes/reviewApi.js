const express = require('express');

const authController = require('../controllers/authController');
const { 
    getReviews, 
    getReview, 
    storeReview, 
    updateReview, 
    destroyReview, 
    softDeleteReview,
    createFilterObj,
    setProdutIdAndUserIdToBody
} = require('../controllers/ReviewController');
const { 
    storeReviewValidator, 
    updateReviewValidator, 
    deleteReviewValidator 
} = require('../utils/validators/reviewValidator');

const router = express.Router({mergeParams : true}); // to access param from parent rout like 'product' => access productId

router.get('/',
    createFilterObj, 
    getReviews
 )
router.get('/show/:id', 
    getReview
)
router.post('/',
    authController.protect,
    authController.allowedTo("user"),
    setProdutIdAndUserIdToBody,
    storeReviewValidator,
    storeReview
)
router.put('/:id',
    authController.protect,
    authController.allowedTo("user"),
    setProdutIdAndUserIdToBody,
    updateReviewValidator,
    updateReview
)
router.delete('/:id',
    authController.protect,
    authController.allowedTo("user" , "maneger" ,"admin"),
    deleteReviewValidator,
    destroyReview
)
router.delete('/softDelete/:id',
    authController.protect,
    authController.allowedTo("user" , "maneger" ,"admin"),
    deleteReviewValidator, 
    softDeleteReview
)


module.exports = router